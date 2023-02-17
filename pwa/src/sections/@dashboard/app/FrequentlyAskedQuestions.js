import React, { useEffect, useState } from 'react'
import { get, map } from "lodash"
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function FrequentlyAskedQuestions() {
  const [faqs, setFaqs] = useState()


  return (
    <div>
      Coming soon
      {/* {map(get(data, 'items'), (faq, index) => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={index}
          >
            <Typography>{get(faq, ['fields', 'question'])}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {get(faq, ['fields', 'answer'])}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))} */}
    </div>
  )
}
