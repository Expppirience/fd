import React, { useEffect, useState } from "react";
import { Box, Container, Toolbar } from "@mui/material";
import Button from "@mui/material/Button/Button";
import FormControl from "@mui/material/FormControl/FormControl";
import { useAllSelector, useAppDispatch } from "../../common/hooks";
import { addPackTC, removePackTC, setPacksTC } from "./packsThunks";
import { packsStateSelect, userStateSelect } from "../../app/selectors";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SuperRange from "./SuperRange";
import {
  setCurrentPage,
  setPackName,
  setPacksSort,
  setPageCount,
  setPreferencePacks,
  setRangeValue,
} from "./packsReducer";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDropDown,
  ArrowDropUp,
  HorizontalRule,
} from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import PacksTable from "./PacksTable";
import { getSortIcon } from "../../common/utils/assets";

const Packs = () => {
  // Selectors
  const user = useAllSelector(userStateSelect);
  const {
    cardPacks,
    page,
    pageCount,
    cardPacksTotalCount,
    max,
    min,
    isMyPack,
  } = useAllSelector(packsStateSelect);
  const dispatch = useAppDispatch();

  // URL & Query
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);

  // Local states
  const [sort, setSort] = useState({ direction: 0, field: "updated" });
  const [addPackMode, setAddPackMode] = useState(false);

  // Utils
  const isAsc = sort.direction === 1;
  const sortIcon = getSortIcon(isAsc);
  const totalPageCount = Math.ceil(cardPacksTotalCount / pageCount);
  const isParamsSet = Object.keys(params).length > 0;

  let timer: number;
  const changeRangeHandler = (valueRange: number[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(setRangeValue({ range: valueRange }));
      setSearchParams({
        ...params,
        min: valueRange[0].toString(),
        max: valueRange[1].toString(),
      });
    }, 200);
  };
  useEffect(() => {
    if (!isParamsSet) {
      dispatch(setPacksTC({}));
      return;
    }
    const model = {
      isMyPack: params.isMyPack,
      pageCount: params.showPerPage,
      page: params.page,
      max: params.max,
      min: params.min,
      sortPacks: sort.field ? `${sort.direction}${sort.field}` : "0updated",
    };
    dispatch(setPacksTC(model));
  }, [searchParams]);

  const changePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    dispatch(setCurrentPage({ page: newPage }));
    setSearchParams({ ...params, page: `${newPage}` });
  };
  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    dispatch(setPageCount({ pageCount: +event.target.value }));
    setSearchParams({ ...params, pageCount: event.target.value });
  };
  const removePack = (id: string) => {
    dispatch(removePackTC(id));
  };

  let timer1: number;
  const setSearch = (value: string) => {
    if (timer1) clearTimeout(timer1);
    timer1 = setTimeout(() => {
      dispatch(setPackName({ packName: value }));
      setSearchParams({ ...params, packName: value });
    }, 500);
  };
  const addPack = (
    newPackName: string,
    newDeckCover: string,
    isPrivate: boolean
  ) => {
    dispatch(addPackTC(newPackName, newDeckCover, isPrivate));
  };
  const setSortForPacks = (type: string) => {
    dispatch(setPacksSort({ type }));
  };
  const handlerIsMyPack = (param: "my" | "all") => {
    dispatch(setPreferencePacks({ param }));
    setSearchParams({ ...params, isMyPack: param === "my" ? "true" : "false" });
  };
  const changeSort = async (field: string) => {
    await setSort({ direction: sort.direction === 0 ? 1 : 0, field });
    setSortForPacks((sort.direction + sort.field).toString());
    setSearchParams((sort.direction + sort.field).toString());
  };
  const showSortIcon = (field: string) => {
    return sort.field === field ? sortIcon : <HorizontalRule />;
  };
  const refreshFilters = () => {
    setSearchParams({});
  };
  return (
    <Box
      style={{ padding: "6rem 2rem", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0",
          }}
        >
          <Container
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0",
            }}
          >
            {/*<Search onChangeCb={setSearch} />*/}
            <FormControl
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "auto 1rem",
              }}
            >
              <Button
                style={{ margin: "auto 1rem" }}
                variant={isMyPack ? "contained" : "outlined"}
                onClick={() => handlerIsMyPack("my")}
              >
                My
              </Button>
              <Button
                variant={!isMyPack ? "contained" : "outlined"}
                onClick={() => handlerIsMyPack("all")}
              >
                All
              </Button>
            </FormControl>

            <SuperRange
              max={max}
              min={min}
              onChangeSlider={changeRangeHandler}
            />
            <Button
              variant="contained"
              onClick={() => setAddPackMode((mode) => !mode)}
            >
              Add new Pack
            </Button>
            <Button
              onClick={() => refreshFilters()}
              style={{ margin: "auto 0" }}
            >
              <DeleteForeverIcon />
            </Button>
          </Container>
        </Toolbar>
      </Box>
      {/*TABLE*/}
      <PacksTable
        id={user._id}
        cardPacks={cardPacks}
        totalPageCount={totalPageCount}
        pageCount={pageCount}
        page={page}
        addPack={addPack}
        addPackMode={addPackMode}
        setAddPackMode={setAddPackMode}
        changePage={changePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        changeSort={changeSort}
        showSortIcon={showSortIcon}
        removePack={removePack}
      />
    </Box>
  );
};

export default Packs;
