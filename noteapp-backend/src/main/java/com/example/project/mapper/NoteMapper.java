package com.example.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.project.entity.Note;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NoteMapper extends BaseMapper<Note> {
    @Select("SELECT * FROM note WHERE user_id = #{userId}")
    List<Note> findByUserId(Long userId);

    @Select("SELECT * FROM note WHERE user_id = #{userId} AND DATE(created_date) = CURDATE()")
    List<Note> findTodayNotesByUserId(Long userId);
}