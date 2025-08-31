package com.example.project.service;

import java.util.List;

import com.example.project.dto.form.NoteCreateForm;
import com.example.project.dto.form.NotebookUpdateForm;
import com.example.project.dto.form.UserLoginForm;
import com.example.project.dto.vo.NoteVO;
import com.example.project.dto.vo.UserLoginVO;

public interface NoteService {
    Long createNote(NoteCreateForm form);
    void deleteNoteByID(Long id);
    void deleteNotesListByUserID(Long userId);
    List<NoteVO> getNotesByUserID(Long userId);
    void updateNote(NotebookUpdateForm form);
    List<NoteVO> getTodayNoteByUserId(Long userId);
    UserLoginVO login(UserLoginForm form);

}