package com.example.project.dto.form;

import com.example.project.entity.Note;
public class NoteCreateForm {
    private Long userId;
    private String content;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Note toEntity() {
        Note note = new Note();
        note.setUserId(this.userId);
        note.setContent(this.content);
        return note;
    }
}
