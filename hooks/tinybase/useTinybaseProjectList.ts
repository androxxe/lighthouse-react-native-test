import { useEffect } from "react";
import { useGetProject } from "../endpoints/useGetProject";
import { useAddRowCallback, useTable, useDelTableCallback } from "tinybase/ui-react";

const ID_CELL = "project_id";
const NAME_CELL = "name";
const PROJECT_TABLE = "projects";

export const useTinybaseProjectList = () => {
  const { data: dataProject, isLoading, ...rest } = useGetProject();

  const data = useTable(PROJECT_TABLE);

  const addRow = useAddRowCallback<{ project_id: string; name: string }>(
    PROJECT_TABLE,
    ({ project_id, name }: { project_id: string; name: string }) => {
      return { [ID_CELL]: project_id, [NAME_CELL]: name };
    },
  );

  const deleteTable = useDelTableCallback<string>(PROJECT_TABLE);

  useEffect(() => {
    if (dataProject?.data && dataProject?.data?.length > 0) {
      deleteTable();
      dataProject.data.forEach((project) => addRow({ project_id: project.id, name: project.name }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProject]);

  return {
    data: Object.values(data),
    isLoading,
    ...rest,
  };
};
