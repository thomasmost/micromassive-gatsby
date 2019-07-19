import { useState } from "react";
import {v4 as uuid} from 'uuid';
import * as faker from 'faker';

export interface IMarketParticipant {
  id: string;
  name: string;
}

export const useMarketParticipants = () => {
  const [participants, setParticipants] = useState<IMarketParticipant[]>([]);
  const createParticipants = (count: number) => {
    let newParticipants = [];
    for (let i = 0; i < count; i++) {
      const id = uuid();
      const name = faker.name.findName();
      newParticipants.push({
        id,
        name
      });
    }
    setParticipants(newParticipants);
  }

  const resetParticipants = () => {
    setParticipants([]);
  }
  return {participants, createParticipants, resetParticipants}
}
