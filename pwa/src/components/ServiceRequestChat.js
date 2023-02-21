import {
    AppBar,
    Toolbar,
    Avatar,
    Stack,
    Grid,
    Button,
    Dialog,
    TextField,
    Divider,
    IconButton,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import { ChatBox, ReceiverMessage, SenderMessage } from "mui-chat-box";


export const ServiceRequestChat = ({active, user, receiver}) => {

    const messages = [
        { from: "foo", content: "Hello there" },
        { from: "bar", content: "Hey how you doing?" },
        { from: "foo", content: "Good thanks, fancy meeting later?" },
        { from: "bar", content: "Sure thing" },
        { from: "bar", content: "I'm ready" },
      ];
    return (
        <Grid>
        <ChatBox>
        {messages.map((m, i) =>
          m.from === "foo" ? (
              <ReceiverMessage key={i} avatar={<Avatar src='' />}>
              {m.content}
            </ReceiverMessage>
          ) : (
            <SenderMessage key={i} avatar={<Avatar src='' />}>
              {m.content}
            </SenderMessage>
          )
        )}
      </ChatBox>
    </Grid>
    );
  }
  