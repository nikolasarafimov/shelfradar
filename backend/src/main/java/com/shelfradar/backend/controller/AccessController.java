package com.shelfradar.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AccessController {

    @GetMapping("/api/store/access")
    public Map<String, String> storeAccess() {

        return Map.of(
                "message",
                "Store Owner access granted."
        );
    }

    @GetMapping("/api/admin/access")
    public Map<String, String> adminAccess() {

        return Map.of(
                "message",
                "Admin access granted."
        );
    }
}