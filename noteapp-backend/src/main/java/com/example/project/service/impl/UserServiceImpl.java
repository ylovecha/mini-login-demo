package com.example.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.project.common.ex.BusinessException;
import com.example.project.dto.vo.UserLoginVO;
import com.example.project.entity.User;
import com.example.project.mapper.UserMapper;
import com.example.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.project.dto.form.UserLoginForm;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;

    @Override
    public UserLoginVO login(UserLoginForm form) {
        // 1. 根据用户名查询用户
        User user = this.userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, form.getUsername())
                        .eq(User::getPassword, form.getPassword())
        );
        if (user != null) {
            UserLoginVO vo = new UserLoginVO();
            vo.setUserId(user.getId());
            vo.setUsername(user.getUsername());
            return vo;
        } else {
            throw new BusinessException("用户名或密码错误");
        }
    }
}