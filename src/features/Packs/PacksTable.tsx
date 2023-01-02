import { Box, TableBody, TableCell } from "@mui/material";
import React, { ReactNode } from "react";

import AddNewPack from "./AddNewPack";
import { IPackResponse } from "./packsAPI";
import { NotFoundElements } from "../../common/components/NotFoundElements/NotFoundElements";
import PackElement from "./PackElement";
import Paper from "@mui/material/Paper/Paper";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import Table from "@mui/material/Table/Table";
import TableContainer from "@mui/material/TableContainer/TableContainer";
import TableHead from "@mui/material/TableHead/TableHead";
import { TablePagination } from "../../common/TablePagination/TablePagination";
import TableRow from "@mui/material/TableRow/TableRow";
import { selectOptions } from "./Packs.data";

interface ITableProps {
  id: string;
  cardPacks: IPackResponse[];
  totalPageCount: number;
  pageCount: number;
  page: number;
  isMyPack: boolean;
  addPackMode: boolean;
  setAddPackMode: (set: boolean) => void;
  addPack: (s: string, d: string, b: boolean) => void;
  changeSort: (field: string) => void;
  showSortIcon: (field: string) => ReactNode;
  removePack: (id: string) => void;
  handleChangeRowsPerPage: (event: SelectChangeEvent) => void;
  changePage: (event: React.ChangeEvent<unknown>, newPage: number) => void;
}

const PacksTable: React.FC<ITableProps> = React.memo(
  ({
    id,
    addPack,
    changeSort,
    removePack,
    handleChangeRowsPerPage,
    changePage,
    showSortIcon,
    cardPacks,
    totalPageCount,
    page,
    pageCount,
    setAddPackMode,
    isMyPack,
  }) => {
    return (
      <Paper sx={{ position: "relative" }}>
        <Paper>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align={"center"}>CardsCount</TableCell>
                  <TableCell
                    onClick={() => changeSort("updated")}
                    align={"center"}
                  >
                    <Box>Updated{showSortIcon("updated")}</Box>
                  </TableCell>
                  <TableCell align={"center"}>Author Name</TableCell>
                  <TableCell align={"center"}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!!cardPacks ? (
                  cardPacks.map((pack) => (
                    <PackElement
                      key={pack._id}
                      id={id}
                      removePack={removePack}
                      pack={pack}
                      isMyPack={isMyPack}
                    />
                  ))
                ) : (
                  <TableRow>
                    <NotFoundElements title={"Empty"} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TablePagination
              title={"Packs"}
              totalPages={totalPageCount}
              elementsPerPage={pageCount}
              changePageHandler={changePage}
              changeElementsPerPage={handleChangeRowsPerPage}
              currentPage={page}
              selectOptions={selectOptions}
            />
          </Box>
        </Paper>
        <AddNewPack addPack={addPack} setAddPackMode={setAddPackMode} />
      </Paper>
    );
  }
);

export default PacksTable;
