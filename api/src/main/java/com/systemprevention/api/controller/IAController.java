package com.systemprevention.api.controller;

import com.systemprevention.api.dto.DeltaChatRequest;
import com.systemprevention.api.dto.DeltaChatResponse;
import com.systemprevention.api.service.GroqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IAController {

    private final GroqService groqService;

    @PostMapping("/delta")
    public DeltaChatResponse conversarComDelta(@RequestBody @Valid DeltaChatRequest request) {
        return groqService.conversarComDelta(request);
    }
}
