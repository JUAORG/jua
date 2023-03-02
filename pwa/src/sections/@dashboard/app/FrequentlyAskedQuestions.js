import React from 'react';
import axios from 'axios';
import { get, map } from 'lodash';
import { useQuery } from 'react-query';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AnimationsSkeleton } from '../../../components/Skeletons';

export default function FrequentlyAskedQuestions() {
  const { isLoading, isError, data, error, refetch } = useQuery(['frequentlyAskedQuestions'], () =>
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/frequently_asked_questions/`,
      withCredentials: false,
    })
      .then((res) => res.data)
      .catch((error) => console.error(error))
  );

  return (
    <div>
      {data &&
        map(data, (faq, index) => (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id={index}>
              <Typography>{get(faq, 'title')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{get(faq, 'body')}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      {isLoading && <AnimationsSkeleton />}
      {isError && 'Error'}
    </div>
  );
}
