import { openDB as createDB } from "idb";

export const openDB = async (name: string, version: number, upgrade: any) => {
  return await createDB(name, version, {
    upgrade,
  });
};
