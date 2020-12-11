import React from "react";
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { RouteItem } from '../../routes';

/* eslint-disable-next-line */


export interface DrawerListCtx {
  items: RouteItem[]
}

function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}

export default function DrawerList({ items }: DrawerListCtx) {
  return (
    <List>
      {items.map(({ text, link }: RouteItem, index: number) => {
          return (
            <ListItemLink to={link} key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemLink>
          )
        })}
    </List>
  );
}
