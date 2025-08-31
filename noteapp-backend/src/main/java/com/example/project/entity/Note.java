package com.example.project.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("note")
public class Note {
    @TableId(type = IdType.AUTO)
    private Long id; // 自增主键
    
    @TableField("user_id")
    private Long userId; // 关联 User 表的 id
    
    private String content; // 笔记内容
    
    @TableField("created_date")
    private LocalDateTime createdDate; // 创建时间
    
    @TableField("updated_date")
    private LocalDateTime updatedDate; // 更新时间
}
