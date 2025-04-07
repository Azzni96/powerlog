import {Request, Response} from 'express';
import {createFormQuestion, getFormQuestions, updateFormQuestion, deleteFormQuestionById} from '../model/formQuestionModel';


export const createFormQuestionController = async (req: Request, res: Response) => {
    try {
        const formQuestion = req.body;
        await createFormQuestion(formQuestion);
        res.status(201).json({message: 'Form question created successfully'});
    } catch (error) {
        console.error('Error creating form question:', error);
        res.status(500).json({error: 'Failed to create form question'});
    }
};

export const getFormQuestionsController = async (req: Request, res: Response) => {
    try {
        const formQuestions = await getFormQuestions();
        res.status(200).json(formQuestions);
    } catch (error) {
        console.error('Error fetching form questions:', error);
        res.status(500).json({error: 'Failed to fetch form questions'});
    }
};

export const updateFormQuestionController = async (req: Request, res: Response) => {
    try {
        const formQuestion = req.body;
        await updateFormQuestion(formQuestion);
        res.status(200).json({message: 'Form question updated successfully'});
    } catch (error) {
        console.error('Error updating form question:', error);
        res.status(500).json({error: 'Failed to update form question'});
    }
};

export const deleteFormQuestionController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        await deleteFormQuestionById(Number(id));
        res.status(200).json({message: 'Form question deleted successfully'});
    } catch (error) {
        console.error('Error deleting form question:', error);
        res.status(500).json({error: 'Failed to delete form question'});
    }
};

