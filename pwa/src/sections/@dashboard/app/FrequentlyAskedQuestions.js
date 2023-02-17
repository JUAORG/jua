import React, { useEffect, useState } from 'react'
import { get, map } from "lodash"
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { fetchFrequentlyAskedQuestions } from '../../../actions/About'

export default function FrequentlyAskedQuestions() {
  const [frequentlyAskedQuestions, setFrequentlyAskedQuestions] = useState()

  useEffect(() => {
    fetchFrequentlyAskedQuestions()
      .then((response) => {
        setFrequentlyAskedQuestions(response.data)
      }).catch((error) => {
        console.error(error)
      })
  }, [])


  return (
    <div>
      {map(frequentlyAskedQuestions, (faq, index) => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={index}
          >
            <Typography>{get(faq, 'title')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {get(faq, 'body')}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
