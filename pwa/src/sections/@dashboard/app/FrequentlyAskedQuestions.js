import * as React from 'react'
import { get, map } from "lodash"
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { faqs } from '../../../_mock/faqs'

export default function FrequentlyAskedQuestions() {

  return (
    <div>
      {map(faqs, (faq, index) => (
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