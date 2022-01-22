import * as React from "react";
import { Component } from "react";
import { Header } from "../../common/header/Header";
import "./Home.css";
import { moviesData } from "../../common/moviesData";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import CardHeader from "@mui/material/CardHeader";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import genres from "../../common/genre";
import artists from "../../common/artists";
import TextField from "@mui/material/TextField";

const flexContainer = {
  flexWrap: "nowrap",
  transform: "translateZ(0)",
};

const styles = (theme) => ({
  colorClass: {
    color: theme.palette.primary.light,
  },
  marginClass: {
    margin: theme.spacing(1),
  },
  darkClass: {
    color: theme.palette.primary.dark,
  },
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moviesData: moviesData,
      genres: genres,
      artists: artists,
      genreName: [],
      artistName: [],
      movieName: "",
      releaseStartDate: "",
      releaseEndDate: "",
    };
    this.genreHandleChange = this.genreHandleChange.bind(this);
    this.artistHandleChange = this.artistHandleChange.bind(this);
    this.applyButtonHandler = this.applyButtonHandler.bind(this);
  }

  genreHandleChange = (event) => {
    const {
      target: { value },
    } = event;
    this.setState((state) => {
      // On autofill we get a stringified value.
      return {
        ...state,
        genreName: typeof value === "string" ? value.split(",") : value,
      };
    });
  };
  artistHandleChange = (event) => {
    const {
      target: { value },
    } = event;
    this.setState((state) => {
      // On autofill we get a stringified value.
      return {
        ...state,
        artistName: typeof value === "string" ? value.split(",") : value,
      };
    });
  };

  applyButtonHandler = () => {
    let moviesCopy = this.state.moviesData;
    let filteredMovies = moviesCopy.filter((movie) => {
      let movieTitle = this.state.movieName;
      let genresSelected = this.state.genreName;
      let artistsSelected = this.state.artistName;
      let selectedStartDate = this.state.releaseStartDate;
      let selectedEndDate = this.state.releaseEndDate;

      let condn1 =
        movieTitle === "" ||
        movieTitle.toLowerCase() === movie.title.toLowerCase();
      let condn2 =
        genresSelected.length === 0 ||
        genresSelected.some((val) => movie.genres.includes(val));
      let artistsNames = movie.artists.map((obj) => {
        return obj.first_name + " " + obj.last_name;
      });
      let condn3 =
        artistsSelected.length === 0 ||
        artistsSelected.some((val) => artistsNames.includes(val));
      let condnA = selectedStartDate === "";
      let condnB = selectedEndDate === "";
      let condn4 = true;

      let movieReleaseDate;
      movieReleaseDate = movie.release_date.split("T")[0];
      if (condnA && condnB) {
        condn4 = true;
      } else if (
        !condnA &&
        !condnB &&
        new Date(selectedStartDate) <= new Date(movieReleaseDate) &&
        new Date(movieReleaseDate) <= new Date(selectedEndDate)
      ) {
        condn4 = true;
      } else if (!condnA && selectedStartDate === movieReleaseDate) {
        condn4 = true;
      } else if (!condnB && selectedEndDate === movieReleaseDate) {
        condn4 = true;
      } else {
        condn4 = false;
      }
      console.log(condn1, condn2, condn3, condn4);
      return condn1 && condn2 && condn3 && condn4;
    });
    console.log(filteredMovies);
    this.setState((state) => {
      return { ...state, moviesData: filteredMovies };
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header />
        <span className="heading">Upcoming Movies</span>
        <ImageList style={flexContainer} cols={6} rowHeight={250}>
          {this.state.moviesData.map((item) => (
            <ImageListItem className="imageListItem" key={item.id}>
              <img src={item.poster_url} alt="movie image" />
              <ImageListItemBar title={item.title} />
            </ImageListItem>
          ))}
        </ImageList>
        <div className="flex-container">
          <div className="left">
            <ImageList cols={4} rowHeight={350} gap={20}>
              {this.state.moviesData.map((item) => (
                <ImageListItem key={item.id}>
                  <img src={item.poster_url} alt="movie image" />
                  <ImageListItemBar
                    title={item.title}
                    subtitle={
                      "Release Date:" +
                      new Date(item.release_date)
                        .toLocaleDateString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        .replaceAll(",", "")
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </div>
          <div className="right">
            <Card
              sx={{
                minWidth: 240,
                maxWidth: 300,
                classes: classes.marginClass,
                width: 280,
              }}
            >
              <CardContent>
                <CardHeader
                  title="FIND MOVIES BY:"
                  className={classes.colorClass}
                />
                <FormControl margin="dense" sx={{ width: 230 }}>
                  <TextField
                    id="standard-basic"
                    label="Movie Name"
                    variant="standard"
                    value={this.state.movieName}
                    onChange={(e) => {
                      this.setState((state) => {
                        return { ...state, movieName: e.target.value };
                      });
                    }}
                  />
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ width: 230 }}
                  margin="dense"
                >
                  <InputLabel>Genres</InputLabel>
                  <Select
                    multiple
                    value={this.state.genreName}
                    onChange={this.genreHandleChange}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {this.state.genres.map((item) => (
                      <MenuItem key={item.name} value={item.name}>
                        <Checkbox
                          checked={this.state.genreName.indexOf(item.name) > -1}
                        />
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ width: 230 }}
                  margin="dense"
                >
                  <InputLabel>Artists</InputLabel>
                  <Select
                    multiple
                    value={this.state.artistName}
                    onChange={this.artistHandleChange}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {this.state.artists.map((item) => {
                      let artistFullName =
                        item.first_name + " " + item.last_name;
                      return (
                        <MenuItem key={artistFullName} value={artistFullName}>
                          <Checkbox
                            checked={
                              this.state.artistName.indexOf(artistFullName) > -1
                            }
                          />
                          <ListItemText primary={artistFullName} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl margin="normal">
                  <TextField
                    variant="standard"
                    id="date"
                    label="Release Date Start"
                    type="date"
                    sx={{ width: 230 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.releaseStartDate}
                    onChange={(e) => {
                      this.setState((state) => {
                        return { ...state, releaseStartDate: e.target.value };
                      });
                    }}
                  />
                </FormControl>
                <FormControl margin="normal">
                  <TextField
                    variant="standard"
                    id="date"
                    label="Release End Start"
                    type="date"
                    sx={{ width: 230 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.releaseEndDate}
                    onChange={(e) => {
                      this.setState((state) => {
                        return { ...state, releaseEndDate: e.target.value };
                      });
                    }}
                  />
                </FormControl>
                <FormControl>
                  <Button
                    onClick={this.applyButtonHandler}
                    sx={{
                      classes: classes.darkClass,
                      width: 230,
                      textAlign: "center",
                    }}
                    variant="contained"
                  >
                    APPLY
                  </Button>
                </FormControl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Home);
