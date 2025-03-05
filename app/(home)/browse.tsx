import { ButtonCreateTask } from "@/components/ButtonCreateTask";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ListTask } from "@/components/ListTask";
import { BadgeStatus } from "@/components/ui/BadgeStatus";
import { Button } from "@/components/ui/Button";
import { Status } from "@/enums/status";
import { useTinybaseTaskList } from "@/hooks/tinybase/useTinybaseTaskList";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useMemo } from "react";
import { Alert, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import twrnc from "twrnc";

export default function BrowseScreen() {
  const { data } = useTinybaseTaskList();

  const list = useMemo(() => data.filter((data) => data.status === Status.Completed), [data]);

  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <Header title="Browse" />
      <View style={twrnc`flex-row justify-end items-center p-2 bg-white gap-x-2`}>
        <BadgeStatus status={Status.Completed} />
        <Button
          label="Filter"
          variant="icon"
          size="small"
          borderColor={twrnc.color("orange-500")}
          borderWidth={2}
          icon={<FontAwesome name="sort-alpha-asc" size={18} color={twrnc.color("orange-500")} />}
          onPress={() => Alert.alert("Under Dev")}
        />
        <Button
          label="Filter"
          variant="icon"
          size="small"
          borderColor={twrnc.color("purple-500")}
          borderWidth={2}
          icon={<Feather name="filter" size={20} color={twrnc.color("purple-500")} />}
          onPress={() => Alert.alert("Under Dev")}
        />
      </View>
      <FlatList
        data={list}
        renderItem={({ item }) => <ListTask task={item} checked={false} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState />}
      />
      <View style={twrnc`flex flex-row p-4 justify-end gap-x-2 absolute bottom-0 right-0 w-full`}>
        <ButtonCreateTask />
      </View>
    </SafeAreaView>
  );
}
