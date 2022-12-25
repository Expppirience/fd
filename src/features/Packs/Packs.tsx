import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper/Paper";
import Table from "@mui/material/Table/Table";
import TableContainer from "@mui/material/TableContainer/TableContainer";
import TableHead from "@mui/material/TableHead/TableHead";
import TableRow from "@mui/material/TableRow/TableRow";
import SearchIcon from "@mui/icons-material/Search";

import {
  alpha,
  Box,
  FormControlLabel,
  InputBase,
  Radio,
  RadioGroup,
  Rating,
  styled,
  TableBody,
  TableCell,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button/Button";

import FormControl from "@mui/material/FormControl/FormControl";
import { useAllSelector, useAppDispatch } from "../../common/hooks";
import { PacksAPI } from "./packsAPI";
import { removePackTC, setPacksTC } from "./packsThunks";
import { packsStateSelect, userStateSelect } from "../../app/selectors";
import AddNewPack from "./AddNewPack";
import SuperRange from "./SuperRange";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
const Packs = () => {
  const user = useAllSelector(userStateSelect);
  const packs = useAllSelector(packsStateSelect);
  const [minPackCount, setMinPackCount] = useState(0);
  const [maxPackCount, setMaxPackCount] = useState(10);
  const [rangeValue, setRangeValue] = useState<number[]>([0, 10]);
  const [addPackMode, setAddPackMode] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPacksTC(user._id));
    // PacksAPI.getCardsPack(id).then((e) => {
    //   console.log(e);
    // });
    console.log(packs);
  }, [user._id]);
  const removePack = (id: string) => {
    dispatch(removePackTC(id));
  };
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{/*<Button>Back packs list</Button>*/}</div>
          <FormControl>
            {/*<RadioGroup value={30} onChange={() => {}}>*/}
            {/*  <FormControlLabel*/}
            {/*    value="Question"*/}
            {/*    control={<Radio color={"secondary"} />}*/}
            {/*    label="Question"*/}
            {/*  />*/}
            {/*  <FormControlLabel*/}
            {/*    value="Answer"*/}
            {/*    control={<Radio color={"secondary"} />}*/}
            {/*    label="Answer"*/}
            {/*  />*/}
            {/*</RadioGroup>*/}
          </FormControl>
          <div>
            <Search>
              <div>
                <SearchIcon />
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </div>
            </Search>
            <SuperRange
              min={minPackCount}
              max={maxPackCount}
              value={rangeValue}
              onChange={(e, newValue) => {
                Array.isArray(newValue) && setRangeValue(newValue);
              }}
            />
          </div>
          <div>
            {/*<Button>Add new card</Button>*/}
            <Button onClick={() => setAddPackMode((mode) => !mode)}>
              Add new Pack
            </Button>
          </div>
        </Toolbar>
      </Box>
      {/*TABLE*/}
      {!addPackMode ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align={"center"}>CardsCount</TableCell>
                <TableCell align={"center"}>Updated</TableCell>
                <TableCell align={"center"}>Author Name</TableCell>
                <TableCell align={"center"}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packs.map((pack) => (
                <TableRow key={pack._id}>
                  <TableCell component="th" scope="row">
                    {pack.name}
                  </TableCell>
                  <TableCell align="center">{pack.cardsCount}</TableCell>
                  <TableCell align="center">{pack.created}</TableCell>
                  <TableCell align="center">
                    <Typography>{pack.user_name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Button onClick={() => removePack(pack._id)}>Delete</Button>
                    <Button>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <AddNewPack setAddPackMode={setAddPackMode} />
      )}
    </div>
  );
};

export default Packs;