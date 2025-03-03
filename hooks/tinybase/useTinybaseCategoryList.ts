import { useEffect } from "react";
import { useAddRowCallback, useTable, useDelTableCallback } from "tinybase/ui-react";
import { useGetCategory } from "../endpoints/useGetCategory";

const ID_CELL = "category_id";
const NAME_CELL = "name";
const CATEGORY_TABLE = "categories";

export const useTinybaseCategoryList = () => {
  const { data: dataCategory, isLoading, ...rest } = useGetCategory();

  const data = useTable(CATEGORY_TABLE);

  const addRow = useAddRowCallback<{ category_id: string; name: string }>(
    CATEGORY_TABLE,
    ({ category_id, name }: { category_id: string; name: string }) => {
      return { [ID_CELL]: category_id, [NAME_CELL]: name };
    },
  );

  const deleteTable = useDelTableCallback<string>(CATEGORY_TABLE);

  useEffect(() => {
    if (dataCategory?.data && dataCategory?.data?.length > 0) {
      deleteTable();
      dataCategory.data.forEach((category) => addRow({ category_id: category.id, name: category.name }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCategory]);

  return {
    data: Object.values(data),
    isLoading,
    ...rest,
  };
};
