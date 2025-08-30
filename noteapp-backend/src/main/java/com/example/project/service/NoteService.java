package com.example.project.service;
import com.example.project.entity.Note;
import java.util.List;

public interface NoteService {
    void save(Note note);
    List<Note> getNotesByUserId(Long userId);
    void deleteById(Long noteId);
}