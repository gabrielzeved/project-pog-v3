import { Prisma } from '@prisma/client';
import { prismaClient } from '../app.config';

export default class CharacterController {
  async createCharacter(userId: string, characterData: Prisma.CharacterCreateInput) {
    try {
      const character = await prismaClient.character.create({
        data: {
          ...characterData,
          user: {
            connect: { id: userId }
          }
        }
      });

      await prismaClient.user.update({
        where: { id: userId },
        data: {
          characterId: character.id
        }
      });

      return character;
    } catch (error) {
      console.error('Erro ao criar o Character:', error);
      throw new Error('Erro ao criar o Character');
    }
  }

  async deleteCharacter(userId: string, characterId: string) {
    try {
      // Verifica se o Character pertence ao User
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        include: { character: true }
      });

      if (user?.characterId !== characterId) {
        throw new Error('Character não pertence ao User');
      }

      await prismaClient.character.delete({
        where: { id: characterId }
      });

      await prismaClient.user.update({
        where: { id: userId },
        data: {
          characterId: null
        }
      });

      return { message: 'Character deletado com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar o Character:', error);
      throw new Error('Erro ao deletar o Character');
    }
  }

  async getUserCharacter(userId: string) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        include: { character: true }
      });

      if (!user || !user.character) {
        throw new Error('Character não encontrado para o usuário especificado');
      }

      return user.character;
    } catch (error) {
      console.error('Erro ao buscar o Character do User:', error);
      throw new Error('Erro ao buscar o Character do User');
    }
  }

  async updateCharacter(characterId: string, characterData: Prisma.CharacterUpdateInput) {
    try {
      const character = await prismaClient.character.update({
        where: { id: characterId },
        data: characterData
      });

      return character;
    } catch (error) {
      console.error('Erro ao atualizar o Character:', error);
      throw new Error('Erro ao atualizar o Character');
    }
  }
}
