import { connectToDatabase } from "@/utils/mongoose";
import { User } from "@/models/User";
import { userInputSchema } from "@/schemas/userSchema";
import { compare, hash } from "bcryptjs";
import { loginInputSchema } from "@/schemas/loginSchema";
import jwt from "jsonwebtoken";
import { Session } from "@/models/Session";

export async function registerUser(body: any) {

  const validation = userInputSchema.safeParse(body);
  if (!validation.success) {
    throw {
      status: 400,
      message: "Formulaire incomplet ou invalide",
      error: validation.error.format(),
    };
  }

  const { name, email, password } = validation.data;

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw {
      status: 409,
      message: "L'utilisateur existe déjà",
    };
  }
  const passwordHash = await hash(password, 12);

  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  const { password: _removed, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
}

export async function loginUser(body: any) {
    const validation = loginInputSchema.safeParse(body);
    if (!validation.success) {
      throw {
        status: 400,
        message: "Identifiants invalides",
        error: validation.error.format(),
      };
    }
  
    const { email, password } = validation.data;
    await connectToDatabase();
  
    const user = await User.findOne({ email });
    if (!user) {
      throw {
        status: 404,
        message: "Utilisateur introuvable",
      };
    }
  
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw {
        status: 401,
        message: "Mot de passe incorrect",
      };
    }
  
    const accessToken = jwt.sign(
      { user_id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  
    const refreshToken = jwt.sign(
      { user_id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
  
    await Session.findOneAndUpdate(
      { user_id: user._id.toString() },
      { $set: { jwt: refreshToken } },
      { upsert: true, new: true }
    );
  
    return {
      accessToken,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  export async function logoutUser(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw {
        status: 400,
        message: "Token manquant ou mal formé",
      };
    }
  
    const token = authHeader.split(" ")[1];
  
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET as string) as { user_id: string };
    } catch (err) {
      throw {
        status: 401,
        message: "Token invalide ou expiré",
        error: err,
      };
    }
  
    await connectToDatabase();
    await Session.deleteOne({ user_id: payload.user_id });
  
    return { message: "Déconnexion réussie" };
  } 

  export async function refreshAccessToken(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw {
        status: 400,
        message: "Refresh token manquant ou mal formé",
      };
    }
  
    const refreshToken = authHeader.split(" ")[1];
    await connectToDatabase();
  
    const session = await Session.findOne({ jwt: refreshToken });
    if (!session) {
      throw {
        status: 403,
        message: "Session invalide ou expirée",
      };
    }
  
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as {
        user_id: string;
        email: string;
      };
    } catch (err) {
      throw {
        status: 401,
        message: "Token invalide ou expiré",
        error: err,
      };
    }
  
    const newAccessToken = jwt.sign(
      { user_id: payload.user_id, email: payload.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  
    return {
      message: "Nouveau token généré",
      token: newAccessToken,
    };
  }
  
  