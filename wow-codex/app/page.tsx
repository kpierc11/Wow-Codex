"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";

const clientID = "0862625a83504ebfb8837633bd425549";
const clientSecret = "4LV1nhA35reksgoBpIv4UuL7yp7dG3l5";

const wowRealmList = [
  { label: ""},
];

interface IWowApiData {
  key: string;
  value: string;
}

export default function Home() {
  const [wowData, setWowData] = useState<any[]>();
  const [wowRealmName, setWowRealmName] = useState<string>("nordrassil");
  const [wowCharName, setWowCharName] = useState<string>("warlic");
  const [wowCharImages, setWowCharImages] = useState<IWowApiData[]>([]);

  function handleFormSubmit(event: any) {
    event.preventDefault();
  }

  useEffect(() => {
    fetch("https://oauth.battle.net/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${clientID}:${clientSecret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return fetch(
          `https://us.api.blizzard.com/profile/wow/character/${wowRealmName}/${wowCharName}/character-media?namespace=profile-us`,
          {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );
      })
      .then((response) => response.json())
      .then((data) => {
        setWowCharImages([...data.assets]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [wowRealmName, wowCharName]);

  return (
    <Container sx={{ marginTop: 10 }} maxWidth="xl">
      <form id="wow-character-name-form" onSubmit={handleFormSubmit}>
        <Box>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 5,
              marginBottom: 10,
              width: "100%",
              p: 2,
            }}
            elevation={1}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <label htmlFor="wow-character-name">Wow Character Name: </label>
              <TextField
                id="wow-character-name"
                label="Character Name"
                variant="filled"
                value={wowCharName}
                onChange={(event) => setWowCharName(event.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <label htmlFor="wow-realm-selection">Wow Realm Select: </label>
              <Autocomplete
                disablePortal
                options={top100Films}
                sx={{ width: 300 }}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setWowRealmName(newValue.label.toLowerCase());
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Realm" />
                )}
              />
            </Box>
          </Paper>
        </Box>
      </form>
      <div className="wow-images">
        <Card sx={{  marginBottom: 20 }}>
          <CardContent>
            <CardMedia
              sx={{ objectFit: "contain", width: "100%", height: "auto" }}
              component="img"
              image={""}
              alt=""
            />
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </div>
    </Container>
  );
}
