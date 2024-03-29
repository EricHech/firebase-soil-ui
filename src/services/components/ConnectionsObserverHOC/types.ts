import { FC } from "react";

// Soil
import type { ListenerPaginationOptions, SoilDatabase, StatefulData } from "firebase-soil";

// Local
import type { GetCache, SetCache } from "../../hooks";

export type Sort = "created oldest" | "created newest" | "updated oldest" | "updated newest";

export type CustomPaginationOpts =
  | {
      edge?: Mandate<ListenerPaginationOptions, "edge">["edge"];
      between?: undefined;
      pagination?: undefined;
    }
  | {
      between?: Mandate<ListenerPaginationOptions, "between">["between"];
      edge?: undefined;
      pagination?: undefined;
    }
  | {
      pagination?: Omit<Mandate<ListenerPaginationOptions, "limit">["limit"], "direction">;
      between?: undefined;
      edge?: undefined;
    };

export type ManagePagination = {
  /** The page size. */
  amount: number;
  /** The number of elements from the end that should trigger another page fetch. */
  buffer: number;
};

export type EmptyComponentProps<T22 extends keyof SoilDatabase, T2 extends Maybe<keyof SoilDatabase> = undefined> = {
  dataType: T22;
  /** This will be undefined if the version is not `connectionDataList` */
  parentDataType: T2;
  /** This will be undefined if the version is not `connectionDataList` */
  parentDataKey: Maybe<string>;
};

export type ItemComponentProps<T22 extends keyof SoilDatabase, T2 extends Maybe<keyof SoilDatabase> = undefined> = {
  top: boolean;
  bottom: boolean;
  idx: number;
  list: [string, number][];
  timestamp: number;
  data: StatefulData<T22>;
  dataType: T22;
  dataKey: string;
  /** This will be undefined if the version is not `connectionDataList` */
  parentDataType: T2;
  /** This will be undefined if the version is not `connectionDataList` */
  parentDataKey: Maybe<string>;
  observed: boolean;
  setCache: SetCache;
  getCache: GetCache;
};

export type GroupingComponentProps = {
  timestamp: number;
};

export type ObservedDataProps<T22 extends keyof SoilDatabase, T2 extends Maybe<keyof SoilDatabase> = undefined> = {
  /** Indicates whether or not you want the card delay animation */
  animate?: boolean;
  idx: number;
  list: [string, number][];
  top: boolean;
  bottom: boolean;
  dataType: T22;
  dataKey: string;
  /** This will be undefined if the version is not `connectionDataList` */
  parentDataType: T2;
  /** This will be undefined if the version is not `connectionDataList` */
  parentDataKey: Maybe<string>;
  /** Make sure that this function is memoed or otherwised saved to avoid infinite re-renders */
  memoizedCustomGet?: (_key: string) => Promise<StatefulData<T22>>;
  timestamp: number;
  observe: (_el: HTMLLIElement) => void;
  observed: boolean;
  setCache: SetCache;
  getCache: GetCache;
  ItemComponent: FC<ItemComponentProps<T22, T2>>;
};

type ConnectionVersion<
  T2 extends keyof SoilDatabase,
  T22 extends keyof SoilDatabase,
  T222 extends keyof SoilDatabase
> = {
  version: "connectionDataList";
  parentDataType: T2;
  parentDataKey: Maybe<string>;
  /** Include this key if you want to use a connectionList other than the dataType you're requesting */
  connectionType?: T222;
  ItemComponent: ObservedDataProps<T22, T2>["ItemComponent"];
  EmptyComponent?: FC<EmptyComponentProps<T22, T2>>;
};

type PublicOrUserListVersion<T22 extends keyof SoilDatabase> = {
  version: "publicDataList" | "userDataList";
  parentDataType?: undefined;
  parentDataKey?: undefined;
  connectionType?: undefined;
  ItemComponent: ObservedDataProps<T22>["ItemComponent"];
  EmptyComponent?: FC<EmptyComponentProps<T22>>;
};

export type Version<T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase, T222 extends keyof SoilDatabase> =
  | ConnectionVersion<T2, T22, T222>
  | PublicOrUserListVersion<T22>;

export type SettingsVersion<
  T2 extends keyof SoilDatabase,
  T22 extends keyof SoilDatabase,
  T222 extends keyof SoilDatabase
> =
  | Omit<ConnectionVersion<T2, T22, T222>, "ItemComponent" | "EmptyComponent">
  | Omit<PublicOrUserListVersion<T22>, "ItemComponent" | "EmptyComponent">;

export type ConnectionsObserverHOCProps<
  T2 extends keyof SoilDatabase,
  T22 extends keyof SoilDatabase,
  T222 extends keyof SoilDatabase
> = Version<T2, T22, T222> & {
  /** The scroll wrapper. This is essential for determining when elements are `observed` and utilizing the `hydrationBufferAmount`. */
  root: Nullable<Element>;
  /** This is required to prevent it from initially fetching all of the data */
  listItemMinHeightPx: number;
  /** This is required to prevent it from initially fetching all of the data */
  listItemMinWidthPx: number;
  /**
   * This number will be multiplied by the `listItemMin` sizes to determine how far
   * the intersection observer will consider `observed` beyond the window boundary
   */
  hydrationBufferAmount: number;
  /** If nothing is passed in, it will fetch all of the keys by default. */
  managePagination?: ManagePagination;
  sort: Sort;
  /**
   * If this is true, `onChildAdded` listeners will only be added to the first page.
   * In some situations, such as with chat, it is unnecessary to have them elsewhere.
   */
  ignoreNonStartingEdgeAdditions?: boolean;
  dataType: T22;
  /** Make sure that this function is memoed or otherwised saved to avoid infinite re-renders */
  memoizedCustomGet?: (_key: string) => Promise<StatefulData<T22>>;
  className?: string;
  /** The provided keys will be omitted from the list */
  omitKeys?: Record<string, boolean>;
  /**
   * Indicates whether or not you want the card delay animation.
   * Allows you to set `--gridCardAnimation` and `--gridCardDelay`.
   */
  animate?: boolean;
  /** Don't forget to memoize. */
  memoizedPrefixedListItems?: JSX.Element;
} & (
    | {
        GroupingComponent: FC<GroupingComponentProps>;
        /** Method by which you want to section the list (ie. day, year, etc.) */
        grouping: "day" | "minute";
      }
    | {
        GroupingComponent?: undefined;
        /** Method by which you want to section the list (ie. day, year, etc.) */
        grouping?: undefined;
      }
  );
