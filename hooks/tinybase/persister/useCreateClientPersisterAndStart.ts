import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";
import { Store } from "tinybase/store";
import { useCreatePersister } from "tinybase/ui-react";
import * as SQLite from "expo-sqlite";

export const useCreateClientPersisterAndStart = (store: Store) =>
  useCreatePersister(
    store,
    (store) => createExpoSqlitePersister(store, SQLite.openDatabaseSync("lighthouse-task-test.db")),
    [],
    (persister) =>
      new Promise((resolve) => {
        persister.load().then(() => persister.startAutoSave().then(() => resolve()));
      }),
  );
