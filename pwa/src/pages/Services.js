import React, {useState, useEffect} from "react"
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'
import Page from '../components/Page'
import { SERVICES } from '../content/services'
import TitlebarBelowImageList from "../components/reusables/TitlebarBelowImageList"

export default function Services() {
  
  return (
    <Page title='Services'>
      <Typography align='Center' variant='h4' sx={{ mb: 5 }}>
        Services
      </Typography>
      <TitlebarBelowImageList itemData={ SERVICES }/>
    </Page>
  )
}
