package com.example.project.controller;

import com.example.project.entity.Note;
import com.example.project.service.NoteService;
import com.example.project.common.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/notes")
public class NoteController {

    private static final Logger logger = LoggerFactory.getLogger(NoteController.class);

    @Autowired
    private NoteService noteService;

    @PostMapping
    public Result addNote(@Valid @RequestBody Note note) {
        try {
            if (note.getUserId() == null) {
                logger.warn("尝试添加笔记时 userId 为空");
                return Result.error("400", "用户 ID 不能为空");
            }

            if (note.getTitle() == null || note.getTitle().trim().isEmpty()) {
                logger.warn("尝试添加笔记时标题为空，用户 ID: {}", note.getUserId());
                return Result.error("400", "标题不能为空");
            }

            if (note.getContent() == null || note.getContent().trim().isEmpty()) {
                logger.warn("尝试添加笔记时内容为空，用户 ID: {}", note.getUserId());
                return Result.error("400", "内容不能为空");
            }

            Note savedNote = noteService.save(note);
            if (savedNote == null) {
                logger.error("笔记保存失败，用户 ID: {}, 笔记数据: {}", note.getUserId(), note);
                return Result.error("500", "保存笔记失败，请稍后重试");
            }

            logger.info("用户 {} 添加笔记成功，笔记 ID: {}", note.getUserId(), savedNote.getId());
            return Result.success(Map.of("data", savedNote));
        } catch (IllegalArgumentException e) {
            logger.error("添加笔记时参数无效: {}", e.getMessage(), e);
            return Result.error("400", "请求参数无效: " + e.getMessage());
        } catch (Exception e) {
            logger.error("添加笔记失败: {}", e.getMessage(), e);
            return Result.error("500", "添加笔记失败，请稍后重试");
        }
    }

    // 其他方法（getNotes, deleteNote）保持不变或按需调整
}