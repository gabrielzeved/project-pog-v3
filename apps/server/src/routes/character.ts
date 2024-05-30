import { User } from '@prisma/client';
import { Request, Response } from 'express';
import CharacterController from '../controllers/character';

interface IUserRequest extends Request {
  user: User;
}

const CreateCharacter = async (req: IUserRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: 'Error - Not authenticated.' });
    }

    const { name } = req.body;

    if (!name || name.length < 3 || name.length >= 14) {
      return res.status(400).json({ message: 'Error - Invalid name.' });
    }

    /* Nenhum personagem criado ainda? */
    if (!user.characterId) {
      const characterController = new CharacterController();

      const character = await characterController.createCharacter(user.id, {
        name,
        x: Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 500)
      });

      return res.status(200).json(character);
    } else {
      return res.status(400).json({ message: 'User already has a character.' });
    }
  } catch (err) {
    console.error(err);
  }
};

export const CharacterRoutes = {
  CreateCharacter
};
