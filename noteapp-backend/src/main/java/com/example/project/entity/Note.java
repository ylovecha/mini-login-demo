package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "notes") // 可选：显式指定表名，若表名与类名不同
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自增主键
    private Long id;
    @Column(name = "user_id", nullable = false) // 关联用户ID
    private Long userId;
    private String title;
    private String content;
    private LocalDateTime createdAt = LocalDateTime.now();
}