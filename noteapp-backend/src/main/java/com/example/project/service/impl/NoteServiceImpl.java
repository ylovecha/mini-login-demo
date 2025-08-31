package com.example.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.project.mapper.NoteMapper;
import com.example.project.mapper.UserMapper;
import com.example.project.service.NoteService;
import com.example.project.dto.form.NoteCreateForm;
import com.example.project.dto.form.NotebookUpdateForm;
import com.example.project.dto.form.UserLoginForm;
import com.example.project.dto.vo.NoteVO;
import com.example.project.dto.vo.UserLoginVO;
import com.example.project.entity.Note;
import com.example.project.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {
    private final NoteMapper noteMapper;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public Long createNote(NoteCreateForm form) {
        Long userId = Long.valueOf(form.getUserId());
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        Note note = new Note();
        note.setUserId(userId);
        note.setContent(form.getContent());
        note.setCreatedDate(LocalDateTime.now());
        note.setUpdatedDate(LocalDateTime.now());
        noteMapper.insert(note);
        return note.getId();
    }

    @Override
    @Transactional
    public void deleteNoteByID(Long id) {
        noteMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteNotesListByUserID(Long userId) {
        LambdaQueryWrapper<Note> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Note::getUserId, userId);
        noteMapper.delete(wrapper);
    }

    @Override
    public List<NoteVO> getNotesByUserID(Long userId) {
        List<Note> notes = noteMapper.findByUserId(userId);
        return notes.stream()
                .map(this::convertToNoteVO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateNote(NotebookUpdateForm form) {
        Note note = noteMapper.selectById(form.getId());
        if (note == null) {
            throw new IllegalArgumentException("笔记不存在");
        }
        note.setContent(form.getContent());
        note.setUpdatedDate(LocalDateTime.now());
        noteMapper.updateById(note);
    }

    @Override
    public List<NoteVO> getTodayNoteByUserId(Long userId) {
        List<Note> notes = noteMapper.findTodayNotesByUserId(userId);
        return notes.stream()
                .map(this::convertToNoteVO)
                .collect(Collectors.toList());
    }

    @Override
    public UserLoginVO login(UserLoginForm form) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, form.getUsername());
        User user = userMapper.selectOne(wrapper);
        if (user == null || !user.getPassword().equals(form.getPassword())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }
        UserLoginVO vo = new UserLoginVO();
        vo.setUserId(user.getId());
        vo.setUsername(user.getUsername());
        return vo;
    }

    private NoteVO convertToNoteVO(Note note) {
        NoteVO vo = new NoteVO();
        vo.setId(note.getId());
        vo.setUserId(note.getUserId());
        vo.setContent(note.getContent());
        vo.setCreatedDate(note.getCreatedDate());
        vo.setUpdatedDate(note.getUpdatedDate());
        return vo;
    }
}