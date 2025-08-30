package com.example.project.service.impl;

import com.example.project.entity.Note;
import com.example.project.mapper.NoteMapper;
import com.example.project.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteMapper noteMapper;

    @Override
    public void save(Note note) {
        noteMapper.insert(note);
    }

    @Override
    public List<Note> getNotesByUserId(Long userId) {
        return noteMapper.selectList(new QueryWrapper<Note>().eq("user_id", userId));
    }

    @Override
    public void deleteById(Long noteId) {
        noteMapper.deleteById(noteId);
    }
}
