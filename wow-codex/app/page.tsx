"use client";
import { useEffect, useState } from "react";

const clientID = "0862625a83504ebfb8837633bd425549";
const clientSecret = "4LV1nhA35reksgoBpIv4UuL7yp7dG3l5";

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
        //console.log(data);

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
        console.log(data.assets);
        setWowCharImages([...data.assets, wowCharImages]);
      });
  }, []);

  return (
    <>
      <form id="wow-character-name-form" onSubmit={handleFormSubmit}>
        <label htmlFor="wow-character-name">Wow Character Name: </label>
        <input
          id="wow-character-name"
          type="text"
          onChange={(event) => {
            console.log(event.target.value);
            setWowCharName(event.target.value);
          }}
        />

        <label htmlFor="wow-realm-selection">Wow Realm Select: </label>
        <select id="wow-realm-selection">
          <option value="tichrondrius">tichrondrius</option>
          <option value="thrall">thrall</option>
          <option value="nordrassil">nordrassil</option>
        </select>
      </form>
      <div className="wow-images">
        {wowCharImages.map((e: IWowApiData, index: number) => (
          <img key={index} src={e.value} height={200} width={200}></img>
        ))}
      </div>
    </>
  );
}
