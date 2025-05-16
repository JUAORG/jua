import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import {
  Stack,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../../actions/firebase'; // Adjust the path to your firebase.js config
import notificationManager from '../../actions/NotificationManager';

export default function AdminFaqManagePage() {
  const formProps = useForm({ defaultValues: { title: '', body: '' } });
  const { register, handleSubmit, reset, setValue } = formProps;
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);

  const fetchFaqs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'frequentlyAskedQuestions'));
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaqs(entries);
    } catch (error) {
      notificationManager.error('Failed to load FAQs', 'Error');
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const onSubmit = async values => {
    try {
      setLoading(true);
      if (editingFaq) {
        // Update existing FAQ
        const faqRef = doc(db, 'frequentlyAskedQuestions', editingFaq.id);
        await updateDoc(faqRef, {
          ...values,
          updatedAt: serverTimestamp(),
        });
        notificationManager.success('FAQ updated successfully', 'Success');
      } else {
        // Create new FAQ
        await addDoc(collection(db, 'frequentlyAskedQuestions'), {
          ...values,
          createdAt: serverTimestamp(),
        });
        notificationManager.success('FAQ created successfully', 'Success');
      }
      reset();
      setEditingFaq(null);
      fetchFaqs();
    } catch (error) {
      notificationManager.error('Failed to submit FAQ', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = faq => {
    setEditingFaq(faq);
    setValue('title', faq.title);
    setValue('body', faq.body);
  };

  const handleDelete = async faqId => {
    try {
      await deleteDoc(doc(db, 'frequentlyAskedQuestions', faqId));
      notificationManager.success('FAQ deleted successfully', 'Success');
      fetchFaqs();
    } catch (error) {
      notificationManager.error('Failed to delete FAQ', 'Error');
    }
  };

  return (
    <Container maxWidth="md">
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField fullWidth required label="FAQ Title" {...register('title')} />
              <TextField fullWidth required multiline minRows={4} label="FAQ Body" {...register('body')} />
              <LoadingButton type="submit" variant="contained" loading={loading}>
                {editingFaq ? 'Update FAQ' : 'Create FAQ'}
              </LoadingButton>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Manage FAQs
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {faqs.map(faq => (
              <ListItem key={faq.id} divider>
                <ListItemText primary={faq.title} secondary={faq.body} />
                <IconButton color="primary" onClick={() => handleEdit(faq)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(faq.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
            {faqs.length === 0 && (
              <Typography variant="body2" sx={{ textAlign: 'center', p: 2 }}>
                No FAQs found.
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
