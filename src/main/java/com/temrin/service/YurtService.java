package com.temrin.service;

import com.temrin.domain.User;
import com.temrin.domain.Yurt;
import com.temrin.repository.YurtRepository;
import org.springframework.stereotype.Service;

@Service
public class YurtService {

    private final YurtRepository yurtRepository;

    public YurtService(YurtRepository yurtRepository) {
        this.yurtRepository = yurtRepository;
    }

    public Yurt getCurrentUserYurt() {
        if (yurtRepository.findByMesulIsCurrentUser().size() != 0) return yurtRepository.findByMesulIsCurrentUser().get(0);

        return null;
    }

    public Yurt getYurtByMesul(User u){
        return yurtRepository.findByMesul(u);
    }
}
