package com.shelfradar.backend.dto.audit;

import java.time.LocalDate;

public record DailyActivityResponse(

        LocalDate date,

        long actions
) {
}