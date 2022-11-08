import * as React from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import {
  Fab,
  Menu,
  MenuItem,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Dialog,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import { FileUploader } from "react-drag-drop-files";
import RegularButton from "../CustomButtons/Button";
import EditPriority from "../editPriority/EditPriority";

function Modal(props) {
  return (
    <Dialog onClose={props.closeModal} open={!!props.info.open}>
      <div className="padding">
        <DialogTitle style={{ alignText: "right", direction: "rtl" }}>
          העלאת קובץ מצגת למועמד/ת - {props.info.name}
        </DialogTitle>
        <FileUploader
          hoverTitle="גרור לכאן את הקובץ"
          label="לחץ או גרור לכאן את הקובץ"
          classes="dragndrop green marginTop"
          handleChange={(file) => {
            props.setFile(file);
          }}
          name="file"
          types={["PPT", "PPTX"]}
        />
        <br />
        <RegularButton
          onClick={async () => {
            props.closeModal();
            props.setLoading(true);
            await props.uploadFileHandler(props.info.id, props.file);
            props.setLoading(false);
          }}
          color="success"
          fullWidth
        >
          לחצו כאן להעלאת הקובץ
        </RegularButton>
      </div>
    </Dialog>
  );
}

function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState();
  const [modal, setModal] = React.useState({
    open: false,
    id: null,
    name: null,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openModal = (id, name) => {
    const infoToInsert = { open: true, id, name };
    setModal({ ...infoToInsert });
  };

  const closeModal = () => {
    setModal({ open: false, id: null, name: null });
    setFile(null);
  };

  const { isWinning, id, name } = props;
  if (!!loading) {
    return (
      <div>
        <Fab
          size="small"
          id="loading"
          aria-controls={open ? "loading" : undefined}
          style={{ backgroundColor: "lightgrey", color: "grey" }}
        >
          <HourglassEmptyIcon />
        </Fab>
      </div>
    );
  }

  return (
    <>
      <div>
        <Fab
          size="small"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          style={{ backgroundColor: "#9c27b0", color: "white" }}
        >
          <MoreVertIcon />
        </Fab>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              props.showDoc(id, "propositionFile");
            }}
          >
            צפה במסמך הצעת המועמד
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              props.showDoc(id, "shortFile");
            }}
          >
            צפה בתקציר המנהלים
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              props.showDoc(id, "bamFile");
            }}
          >
            צפה באישור הב"מ
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              props.showDoc(id, "pptFile");
            }}
          >
            צפה במצגת מועמד
          </MenuItem>
          <MenuItem
            onClick={async () => {
              handleClose();
              setLoading(true);
              await props.toggleWin(id);
              setLoading(false);
            }}
          >
            {!!isWinning ? (
              <span style={{ color: "orange" }}>בטל זכייה</span>
            ) : (
              <span style={{ color: "lightgreen" }}>אשר זכייה</span>
            )}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              props.editPriority(props.isEditing === id ? null : id);
            }}
          >
            <span style={{ color: "purple" }}>
              {props.isEditing === id ? "בטל הזנת תעדוף" : "הזן תעדוף"}
            </span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              openModal(id, name);
            }}
          >
            <span style={{ color: "blue" }}>שנה את קובץ מצגת המועמד</span>
          </MenuItem>
          <MenuItem
            onClick={async () => {
              handleClose();
              setLoading(true);
              await props.deleteContender(id);
              setLoading(false);
            }}
          >
            <span style={{ color: "red" }}>הסר מועמד</span>
          </MenuItem>
        </Menu>
      </div>
      <Modal
        uploadFileHandler={props.uploadFileHandler}
        info={modal}
        openModal={openModal}
        closeModal={closeModal}
        setFile={setFile}
        file={file}
        setLoading={setLoading}
      />
    </>
  );
}

const ContendersTable = (props) => {
  const [nowEditing, setNowEditing] = React.useState();

  const deleteContender = async (id) => {
    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/contenders/deleteContender/${id}`,
        "DELETE",
        JSON.stringify({
          type: "job",
        }),
        {
          "Content-Type": "application/json",
          Authorization: `bearer ${props.token}`,
        }
      );

      if (
        !!response.message &&
        response.message === "Contender has been deleted successfully"
      ) {
        props.setContenders((prev) => prev.filter((i) => i._id !== id));
        props.openModal("warning", "המועמד הוסר");
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך הסרת המועמד");
      props.clearError();
    }
  };

  const toggleWin = async (id) => {
    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/contenders/changeStatus/${id}`,
        "PATCH",
        JSON.stringify({
          type: "job",
        }),
        {
          "Content-Type": "application/json",
          Authorization: `bearer ${props.token}`,
        }
      );

      if (!!response.message && response.message._id === id) {
        let copy = props.contenders;
        const index = copy.findIndex((i) => i._id === id);
        copy[index].isWinning = !!copy[index].isWinning ? false : true;
        props.setContenders([...copy]);
        props.openModal("success", "שונתה הזכייה");
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך שינוי הזכיה");
      props.clearError();
    }
  };

  const showDoc = (id, type) => {
    let path;
    switch (type) {
      case "propositionFile":
        path = "propositionFile";
        break;
      case "shortFile":
        path = "shortFile";
        break;
      case "bamFile":
        path = "bamFile";
        break;
      case "pptFile":
        path = "pptFile";
        break;
      default:
        return;
        break;
    }
    const contenderObj = props.contenders.find((i) => i._id === id);
    if (!!contenderObj && !!contenderObj[path]) {
      window.location.href = `${process.env.NEXT_PUBLIC_API_ADDRESS}${contenderObj[path].path}`;
    }
  };

  const uploadFileHandler = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "job");
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/contenders/changePpt/${id}`,
        "PATCH",
        formData,
        {
          Authorization: `bearer ${props.token}`,
        }
      );

      if (
        !!response.message &&
        !!response.message.pptFile &&
        response.message.pptFile.originalName === file.name
      ) {
        let copy = props.contenders;
        const index = copy.findIndex((i) => i._id === id);
        copy[index].pptFile = response.message.pptFile;
        props.setContenders([...copy]);
        props.openModal("success", "הקובץ הועלה");
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך העלאת הקובץ");
      props.clearError();
    }
  };

  const editPriority = (id) => {
    setNowEditing(id);
  };

  const submitPriority = async (id, number) => {
    const contenderIndex = props.contenders.findIndex((i) => i._id === id);
    if (!!props.contenders[contenderIndex]) {
      if (props.contenders[contenderIndex].priority === number) {
        setNowEditing(null);
        return;
      }
    }

    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/contenders/changePriority/${id}`,
        "PATCH",
        JSON.stringify({
          type: "job",
          priority: number,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `bearer ${props.token}`,
        }
      );

      if (!!response.message && response.message._id === id) {
        let copyArr = props.contenders;
        const index = copyArr.findIndex((i) => i._id === id);
        copyArr[index].priority = number;
        props.setContenders([...copyArr]);
        setNowEditing(null);
        props.openModal("success", "שונתה הזכייה");
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך שינוי הזכיה");
      props.clearError();
      setNowEditing(null);
    }
  };

  const rows = props.contenders
    .map((contender) => {
      return {
        id: contender._id,
        name: contender.name,
        unit: contender.unit,
        phone: contender.phone,
        pikud: contender.pikud,
        ogda: !!contender.ogda ? contender.ogda : "לא צוין",
        saal: contender.saal,
        bam: contender.bam,
        workType: !!contender.jobType ? contender.jobType.title : "אין",
        priority:
          !!nowEditing && contender._id === nowEditing ? (
            <EditPriority
              id={contender._id}
              currentPriority={contender.priority}
              submitPriority={submitPriority}
            />
          ) : (
            contender.priority
          ),
        isWinning: !!contender.isWinning ? (
          <span style={{ color: "lightgreen" }}>זוכה</span>
        ) : (
          <span style={{ color: "orange" }}>לא זוכה</span>
        ),
        options: (
          <BasicMenu
            id={contender._id}
            name={contender.name}
            showDoc={showDoc}
            deleteContender={deleteContender}
            setContenders={props.setContenders}
            isEditing={nowEditing}
            toggleWin={toggleWin}
            isWinning={contender.isWinning}
            uploadFileHandler={uploadFileHandler}
            editPriority={editPriority}
          />
        ),
      };
    })
    .reverse();

  return (
    <TableContainer component={Paper} dir="rtl" style={{ textAlign: "right" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">שם מלא</TableCell>
            <TableCell align="right">יחידה</TableCell>
            <TableCell align="right">מספר טלפון</TableCell>
            <TableCell align="right">פיקוד\זרוע</TableCell>
            <TableCell align="right">אוגדה</TableCell>
            <TableCell align="right">סוג עבודה</TableCell>
            <TableCell align="right">גורם מאשר עבודה יחידתי</TableCell>
            <TableCell align="right">גורם מאשר ב"מ</TableCell>
            <TableCell align="right">תעדוף</TableCell>
            <TableCell align="right">האם זוכה</TableCell>
            <TableCell align="right">פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{row.phone}</TableCell>
              <TableCell align="right">{row.pikud}</TableCell>
              <TableCell align="right">{row.ogda}</TableCell>
              <TableCell align="right">{row.workType}</TableCell>
              <TableCell align="right">{row.saal}</TableCell>
              <TableCell align="right">{row.bam}</TableCell>
              <TableCell align="right">{row.priority}</TableCell>
              <TableCell align="right">{row.isWinning}</TableCell>
              <TableCell align="right">{row.options}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContendersTable;
