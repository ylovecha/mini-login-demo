package com.example.project.controller;

import com.example.project.common.Result;
import com.example.project.dto.form.NoteCreateForm;
import com.example.project.dto.vo.NoteVO;
import com.example.project.entity.Note;
import com.example.project.service.NoteService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService noteService;
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // 新增笔记 (POST)
    @PostMapping
    public Result<Long> createNote(@Valid @RequestBody NoteCreateForm form) {
        return Result.ok(noteService.createNote(form));
    }

    // 获取用户所有笔记 (GET)
    @GetMapping
    public Result<List<NoteVO>> getNotes(@RequestParam Long userId) {
        return Result.ok(noteService.getNotesByUserID(userId));
    }

    // 删除单条笔记 (DELETE)
    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id) {
        noteService.deleteNoteByID(id);
        return Result.ok("删除成功");
    }

    // 删除某用户全部笔记 (DELETE)
    @DeleteMapping("/user/{userId}")
    public Result<String> deleteByUserId(@PathVariable Long userId) {
        noteService.deleteNotesListByUserID(userId);
        return Result.ok("删除成功");
    }
}
