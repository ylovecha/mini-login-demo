package com.example.project.mapper;
import com.example.project.entity.Note;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
@Mapper
public interface NoteMapper extends BaseMapper<Note> {
}
