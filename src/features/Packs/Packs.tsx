import React, { useCallback, useEffect, useState } from "react";
import { Box, debounce } from "@mui/material";
import { useAllSelector, useAppDispatch } from "../../common/hooks";
import { addPackTC, removePackTC, setPacks } from "./packsThunks";
import {
  appStateSelect,
  packsCardsPacksSelector,
  packsIsMyPackSelector,
  packsMaxCardsPacksSelector,
  packsMaxSelector,
  packsMinCardsPacksSelector,
  packsMinSelector,
  packsNameSelector,
  packsPageCountSelector,
  packsPageSelector,
  packsSortPacksSelector,
  packsTotalCardsSelector,
  userStateSelect,
} from "../../app/selectors";
import { packsAC } from "./packsReducer";
import { useSearchParams } from "react-router-dom";
import { HorizontalRule } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import PacksTable from "./PacksTable";
import { getSortIcon } from "../../common/utils/assets";
import PacksHeader from "./PacksHeader";
import styles from "../../common/styles/common.module.css";
import { Preloader } from "../../common/components/Preloader/Preloader";
import AddNewPack from "./AddNewPack";
import PacksModals from "./PacksModals";

const Packs = () => {
  const user = useAllSelector(userStateSelect);
  const { isLoading } = useAllSelector(appStateSelect);
  const packName = useAllSelector(packsNameSelector);
  const cardPacks = useAllSelector(packsCardsPacksSelector);
  const page = useAllSelector(packsPageSelector);
  const pageCount = useAllSelector(packsPageCountSelector);
  const cardPacksTotalCount = useAllSelector(packsTotalCardsSelector);
  const max = useAllSelector(packsMaxSelector);
  const min = useAllSelector(packsMinSelector);
  const isMyPack = useAllSelector(packsIsMyPackSelector);
  const sortPacks = useAllSelector(packsSortPacksSelector);
  const maxCardsCount = useAllSelector(packsMaxCardsPacksSelector);
  const minCardsCount = useAllSelector(packsMinCardsPacksSelector);

  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);

  // Local states
  const [sort, setSort] = useState({ direction: 0, field: "updated" });

  // Utils
  const [addPackMode, setAddPackMode] = useState<boolean>(false);
  const totalPageCount = Math.ceil(cardPacksTotalCount / pageCount);
  const isAsc = sort.direction === 1;
  const sortIcon = getSortIcon(isAsc);
  const isParamsSet = Object.keys(params).length > 0;
  const dispatch = useAppDispatch();

  const changeRangeQueryParams = useCallback(
    debounce((valueRange: number[]) => {
      setSearchParams({
        ...params,
        min: valueRange[0].toString(),
        max: valueRange[1].toString(),
      });
    }, 500),
    []
  );
  const changeRangeHandler = useCallback((valueRange: number[]) => {
    changeRangeQueryParams(valueRange);
    dispatch(packsAC.setRangeValue({ range: valueRange }));
  }, []);

  useEffect(() => {
    if (!isParamsSet) {
      dispatch(setPacks({}));
      return;
    }
    const model = {
      isMyPack: params.isMyPack,
      pageCount: params.showPerPage,
      page: params.page,
      max: params.max,
      min: params.min,
      packName: params.packName,
      sortPacks: sort.field ? `${sort.direction}${sort.field}` : "0updated",
    };
    dispatch(setPacks(model));
  }, [searchParams]);

  const changePage = useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      dispatch(packsAC.setCurrentPage({ page: newPage }));
      setSearchParams({ ...params, page: `${newPage}` });
    },
    [page]
  );
  const handleChangeRowsPerPage = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(packsAC.setPageCount({ pageCount: +event.target.value }));
      setSearchParams({ ...params, pageCount: event.target.value });
    },
    [pageCount]
  );
  const removePack = useCallback((id: string) => {
    dispatch(removePackTC(id));
  }, []);
  const setSearchQueryParams = useCallback(
    debounce((value: string) => {
      setSearchParams({ ...params, packName: value });
    }, 500),
    [packName]
  );

  const changeSearchHandler = useCallback((value: string) => {
    setSearchQueryParams(value);
    dispatch(packsAC.setPackName({ packName: value }));
  }, []);
  const addPack = useCallback(
    (newPackName: string, newDeckCover: string, isPrivate: boolean) => {
      dispatch(addPackTC(newPackName, newDeckCover, isPrivate));
      setSearchParams({ ...params });
    },
    []
  );
  const setSortForPacks = useCallback((type: string) => {
    dispatch(packsAC.setPacksSort({ type }));
  }, []);
  const handlerIsMyPack = useCallback((param: boolean) => {
    dispatch(packsAC.setPreferencePacks({ isMine: param }));
    setSearchParams({ ...params, isMyPack: `${param}` });
  }, []);
  const changeSort = useCallback(
    async (field: string) => {
      await setSort({ direction: sort.direction === 0 ? 1 : 0, field });
      setSortForPacks((sort.direction + sort.field).toString());
      setSearchParams((sort.direction + sort.field).toString());
    },
    [sortPacks]
  );
  const showSortIcon = useCallback((field: string) => {
    return sort.field === field ? sortIcon : <HorizontalRule />;
  }, []);
  const removeSort = useCallback(() => {
    setSearchParams({});
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        padding: "6rem 2rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isLoading && (
        <div className={styles.preventSending}>
          <Preloader />
        </div>
      )}
      <PacksHeader
        removeSort={removeSort}
        setAddPackMode={setAddPackMode}
        changeRangeHandler={changeRangeHandler}
        packName={packName}
        changeSearchHandler={changeSearchHandler}
        isMyPack={isMyPack}
        max={max}
        min={min}
        addPackMode={addPackMode}
        maxCardsCount={maxCardsCount}
        minCardsCount={minCardsCount}
        handlerIsMyPack={handlerIsMyPack}
      />
      {/*TABLE*/}
      <PacksTable
        id={user._id}
        cardPacks={cardPacks}
        totalPageCount={totalPageCount}
        pageCount={pageCount}
        page={page}
        changePage={changePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        changeSort={changeSort}
        showSortIcon={showSortIcon}
        removePack={removePack}
        isMyPack={isMyPack}
      />
      <PacksModals
        open={addPackMode}
        handleClose={() => setAddPackMode(false)}
        modalTitle={"Add New Pack"}
      >
        <AddNewPack addPack={addPack} setAddPackMode={setAddPackMode} />
      </PacksModals>
    </Box>
  );
};

export default Packs;
