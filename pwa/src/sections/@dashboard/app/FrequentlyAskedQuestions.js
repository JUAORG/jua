import React, { useEffect, useState } from 'react'
import { get, map } from "lodash"
import Accordion from '@mui/material/Accordion'
import { useContentful } from 'react-contentful'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function FrequentlyAskedQuestions() {
  const [faqs, setFaqs] = useState()

  const { data, error, fetched, loading } = useContentful({
    contentType: 'faQs',
  })

    if (loading || !fetched) {
    return null;
  }

  if (error) {
    console.error(error);
    return null;
  }

  if (!data) {
    return <p>Page does not exist.</p>;
  }

  return (
    <div>
      {map(get(data, 'items'), (faq, index) => (
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
      ))}
    </div>
  )
}
