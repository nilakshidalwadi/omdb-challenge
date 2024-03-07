import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  CardActionArea,
  OutlinedInput,
  Pagination,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel, { FormLabelProps } from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Radio, { RadioProps } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import React, { useEffect, useMemo, useState } from "react";
import {
  QueryByID,
  SearchEntity,
  SearchQuery,
  movieType,
  omdbSearch,
} from "./models";

const API_KEY = "41736d97";

const MainScreen: React.FunctionComponent = () => {
  // Default variables for range slider and search.
  const minRange = 1970;
  const maxRange = 2024;
  const defaultSearchTitle = "star";

  // used to search the movie data based on its imdbID.
  const [imdbID, setImdbID] = useState<string | null>(null);

  // used to set the data for movie list fetched from API
  const [movieData, setMovieData] = useState<SearchEntity[] | null>(null);

  // Used to set the search query params
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    year: [2000, 2010],
    type: "",
  });

  // Used to get the total records for movie for pagination.
  const [totalMovies, setTotalMovies] = useState<number>(0);

  const maxPages = Math.ceil(totalMovies / 10);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      type: event.target.value as movieType,
      page: 1,
    }));
  };

  const handleRangeChange = (event: Event, newValue: number | number[]) => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      year: newValue as number[],
      page: 1,
    }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      title: event.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      page: value ?? 1,
    }));
  };

  const { title, year, type, page } = searchQuery;

  const getMovieList = useMemo(
    () => async () => {
      fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${
          searchQuery?.title || defaultSearchTitle
        }&y=${searchQuery.year?.join("-") ?? ""}&type=${
          searchQuery.type ?? ""
        }&page=${searchQuery.page}`
      )
        .then((response) => response.json())
        .then((data: omdbSearch) => {
          setMovieData(data?.Search ?? null);
          setTotalMovies(
            isNaN(Number(data?.totalResults)) ? 0 : Number(data?.totalResults)
          );
          setImdbID(data?.Search?.[0]?.imdbID ?? null);
        })
        .catch(() => {
          setMovieData(null);
          setImdbID(null);
        });
    },
    [searchQuery]
  );

  useEffect(() => {
    getMovieList();
  }, [searchQuery]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            backgroundColor: "gray",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              px: 1,
              py: 2,
            }}
          >
            <FormGroup
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Box sx={{ mx: 2, my: 0.5 }}>
                <FormControl>
                  <OutlinedInput
                    value={title ?? defaultSearchTitle}
                    sx={{
                      color: "white",
                      border: "none",
                      "& fieldset": { border: "none" },
                    }}
                    onChange={handleTitleChange}
                    placeholder="Search"
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "white", mr: 1, my: 0.5 }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  mx: 2,
                  my: 0.5,
                  flexGrow: 1,
                  minWidth: "200px",
                  maxWidth: "400px",
                }}
              >
                <FormControl sx={{ display: "flex", flexDirection: "column" }}>
                  <WhiteFormLabel>Year</WhiteFormLabel>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item sx={{ color: "white" }}>
                      {minRange}
                    </Grid>
                    <Grid item sx={{ flexGrow: 1 }}>
                      <Slider
                        sx={{ color: "white" }}
                        value={year}
                        onChange={handleRangeChange}
                        min={minRange}
                        max={maxRange}
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                    <Grid item sx={{ color: "white" }}>
                      {maxRange}
                    </Grid>
                  </Grid>
                </FormControl>
              </Box>
              <Box sx={{ mx: 2, my: 0.5 }}>
                <FormControl>
                  <WhiteFormLabel>Type</WhiteFormLabel>
                  <RadioGroup
                    row
                    name="type-radio-buttons-group"
                    value={type}
                    onChange={handleTypeChange}
                    sx={{ color: "white" }}
                  >
                    <FormControlLabel
                      control={<WhiteRadio />}
                      value=""
                      label="Any"
                    />
                    <FormControlLabel
                      control={<WhiteRadio />}
                      value="movie"
                      label="Movies"
                    />
                    <FormControlLabel
                      control={<WhiteRadio />}
                      value="series"
                      label="Series"
                    />
                    <FormControlLabel
                      control={<WhiteRadio />}
                      value="episodes"
                      label="Episodes"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </FormGroup>
          </Box>
        </header>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Box
          overflow="auto"
          sx={{
            borderRight: "1px solid gray",
            flex: "0 0 35%",
          }}
        >
          <Box
            sx={{
              padding: "20px",
            }}
          >
            {totalMovies + ` Results`}
          </Box>
          <Box>
            {(movieData?.length ?? 0) > 0 &&
              movieData?.map((movie) => (
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    border: "none",
                    borderRadius: "0px",
                    borderBottom: "1px solid black",
                    backgroundColor:
                      movie.imdbID === imdbID ? "rgba(0, 0, 0, 0.12)" : "unset",
                  }}
                >
                  <CardActionArea onClick={() => setImdbID(movie.imdbID)}>
                    <Box sx={{ display: "flex" }}>
                      <CardMedia
                        component="img"
                        sx={{ width: "20%", height: "20%", padding: "10px" }}
                        image={movie.Poster}
                        alt="poster not available"
                      />
                      <CardContent sx={{ display: "block" }}>
                        <Typography>{movie.Title}</Typography>
                        {movie.Year}
                      </CardContent>
                    </Box>
                  </CardActionArea>
                </Card>
              ))}
          </Box>
          {maxPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", padding: 1 }}>
              <Pagination
                count={maxPages}
                page={page}
                size="small"
                variant="outlined"
                shape="rounded"
                onChange={handlePageChange}
              />
            </Box>
          )}
        </Box>
        <Box overflow="auto">
          {imdbID !== null && <MovieDetails imdbID={imdbID} />}
        </Box>
      </div>
    </Box>
  );
};

// Reusable white label component.
const WhiteFormLabel = (props: FormLabelProps) => {
  return (
    <FormLabel
      {...props}
      sx={{
        color: "white",
        "&.Mui-focused": {
          color: "white",
        },
        ...props?.sx,
      }}
    />
  );
};

// Reusable radio button with white theme.
const WhiteRadio = (props: RadioProps) => {
  return (
    <Radio
      {...props}
      sx={{
        color: "white",
        "&.Mui-checked": {
          color: "white",
        },
        ...props?.sx,
      }}
    />
  );
};

// Below function is used to get the movie data based on IMDB ID.
const MovieDetails: React.FunctionComponent<{ imdbID: string }> = (props) => {
  // Used to maintain the data for a movie
  const [moviedetails, setMovieDetails] = useState<QueryByID>();

  // Calls the API to fetch single movie detail by passing IMDB ID.
  useEffect(() => {
    const fetchMovieDetail = async () => {
      await fetch(
        "http://www.omdbapi.com/?apikey=" + API_KEY + "&i=" + props.imdbID
      )
        .then((response) => response.json())
        .then((data) => setMovieDetails(data));
    };
    fetchMovieDetail();
  }, [props.imdbID]);

  const [watchList, setWatchList] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("watchlistItems", JSON.stringify(watchList));
  }, [watchList]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("watchlistItems") ?? "[]");
    if (items) {
      setWatchList(items);
    }
  }, []);

  const isAddedToWatchList = (imdbID: string) => {
    return watchList.includes(imdbID);
  };

  const toggleWatchList = (imdbID: string) => {
    if (isAddedToWatchList(imdbID)) {
      setWatchList((watchList) => watchList.filter((id) => id !== imdbID));
      alert("Movie removed from watch list.");
    } else {
      setWatchList((watchList) => [...watchList, imdbID]);
      alert("movie added to watch list.");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <div
        style={{
          padding: "20px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            height="30%"
            width="30%"
            style={{ display: "block", marginRight: "10px" }}
            src={moviedetails?.Poster}
            alt="poster not available"
          />
          <div>
            <h1>{moviedetails?.Title}</h1>
            <div style={{ display: "inline" }}>
              <text
                style={{
                  border: "1px solid black",
                  borderRadius: "10%",
                  padding: "5px",
                  marginRight: "10px",
                  lineHeight: "32px",
                  minHeight: "10%",
                  minWidth: "10%",
                }}
              >
                {moviedetails?.Rated}
              </text>
              <text>
                {moviedetails?.Year} • {moviedetails?.Genre} •{" "}
                {moviedetails?.Runtime}
              </text>
            </div>
            <div style={{ marginTop: "30px" }}>
              <text>{moviedetails?.Actors}</text>
            </div>
          </div>
          <div style={{ alignSelf: "flex-start" }}>
            <Button
              variant="outlined"
              startIcon={
                isAddedToWatchList(props.imdbID) ? (
                  <BookmarkIcon />
                ) : (
                  <BookmarkBorderIcon />
                )
              }
              style={{ color: "black", borderColor: "black" }}
              onClick={() => toggleWatchList(props.imdbID)}
            >
              Watchlist
            </Button>
          </div>
        </div>
        <Divider sx={{ my: "30px" }} />
        <div>
          <text>{moviedetails?.Plot}</text>
        </div>
        <Divider sx={{ my: "30px" }} />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          {moviedetails?.Ratings?.length !== undefined &&
            moviedetails?.Ratings?.map((rating, index) => (
              <>
                <Box
                  sx={{
                    borderLeft: index === 0 ? "none" : "1px solid black",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography>{rating.Value}</Typography>
                  <Typography>{rating.Source}</Typography>
                </Box>
              </>
            ))}
        </Box>
      </div>
    </div>
  );
};

export { MainScreen };
