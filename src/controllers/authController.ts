import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response } from 'express';
import { verifyEmail } from '@devmehq/email-validator-js';
import { CustomError } from '../types/Error';

exports.login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

function isPasswordSecure(password: string) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasDigits &&
    hasSpecialChars
  );
}

exports.register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'El usuario ya existe' });

    if (!isPasswordSecure(password))
      return res.status(400).json({
        message:
          'La contraseña no es segura. Debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, dígitos y caracteres especiales.',
      });
    const { validSmtp } = await verifyEmail({
      emailAddress: email,
      verifySmtp: true,
      timeout: 3000,
    });
    if (!validSmtp)
      return res.status(400).json({
        message: 'El correo no es valido o no existe.',
      });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      },
    );
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    const error = err as CustomError;
    res
      .status(500)
      .json({ message: 'Error en el servidor', error: error.message });
  }
};
