import styles from "./page.module.scss";
import axios from "axios";
import Image from "next/image";
import { IGetHomePageData, IUser, TableFields } from "./types";

const createNamesFields = (tableItems: IUser[]): TableFields[] => {
  const newTableFiels: TableFields[] = [];
  for (const tableItem of tableItems) {
    for (const propertyTableItem of Object.keys(tableItem)) {
      if (!newTableFiels.includes(propertyTableItem)) {
        newTableFiels.push(propertyTableItem);
      }
    }
  }
  newTableFiels.push("action");

  const fieldPhotoExists = newTableFiels.find((item) => item === "photo");

  let resultedTableFiels: TableFields[] = [];

  if (fieldPhotoExists) {
    resultedTableFiels = newTableFiels.filter((item) => item !== "photo");
    resultedTableFiels.unshift("photo");
  }
  return resultedTableFiels;
};

type HomeData = { data: IGetHomePageData; tableFields: TableFields[] };

async function getData(): Promise<HomeData> {
  const { data } = await axios("https://tz.smart-ui.pro/");
  const tableFields = createNamesFields(data.users);
  return { data, tableFields };
}

export default async function Home() {
  const { data, tableFields } = await getData();
  const createTableItem = (item: TableFields, user: IUser) => {
    switch (item) {
      case "online":
        if (user[item]) {
          return "online";
        } else {
          return "offline";
        }
      case "action":
        return (
          <button
            className={styles["table__item-button"]}
            disabled={!user.online}
          >
            Chat
          </button>
        );
      case "photo":
        return (
          <div className={styles["table__item-avatar"]}>
            <Image
              src={user[item]!}
              width="264"
              height="133"
              alt="icon"
              className={styles["table__item-icon"]}
            />
          </div>
        );
      case "age":
        return user[item] + " year";
      default:
        return user[item];
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}></header>

      <main className={styles.main}>
        <div className={styles["video-block"]}>
          <div className={styles["video-block__info"]}>
            <p className={styles["video-block__embed"]}>{data.video.embed}</p>
            <p className={styles["video-block__text"]}>{data.video.text}</p>
            <p className={styles["video-block__link"]}>{data.video.link}</p>
          </div>
          <iframe
            width="480"
            height="270"
            className={styles["video-block__video-player"]}
            src={"https://www.youtube.com/embed/" + data.video.embed}
            title="Самые красивые цвета природы в 4K III 🐦 Разноцветные животные. Антистрессовая музыка - 4K UHD TV"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div>
        <div className={styles.table}>
          <h2 className={styles["table__header"]}>our users</h2>
          <div className={styles["table__container"]}>
            <div className={styles["table__head-row"]}>
              {tableFields.map((item) => (
                <div key={item} className={styles["table__field"]}>
                  {item === "online" ? "status" : item}
                </div>
              ))}
            </div>
            {data.users.map((user: any) => (
              <div key={user.photo} className={styles["table__row"]}>
                {tableFields.map((item) => (
                  <div
                    key={item + user.photo}
                    className={styles["table__item"]}
                  >
                    {createTableItem(item, user)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
