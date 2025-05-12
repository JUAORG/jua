import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { get, map } from 'lodash';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AnimationsSkeleton } from '../../../components/Skeletons';
import { db } from '../../../actions/firebase';

export default function FrequentlyAskedQuestions() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const q = query(collection(db, 'frequentlyAskedQuestions'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const entries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFaqs(entries);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  if (loading) return <AnimationsSkeleton />;
  if (error) return <Typography color="error">Failed to load FAQs</Typography>;
  if (faqs.length === 0) return <Typography>No FAQs found.</Typography>;

  return (
    <div>
      {map(faqs, (faq, index) => (
        <Accordion key={faq.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id={faq.id}>
            <Typography>{get(faq, 'title', 'Untitled')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{get(faq, 'body', 'No content')}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
