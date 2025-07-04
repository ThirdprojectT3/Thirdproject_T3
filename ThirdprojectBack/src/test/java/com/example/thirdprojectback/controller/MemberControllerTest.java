package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.dto.MemberResponseDto;
import com.example.thirdprojectback.entity.Member.Gender;
import com.example.thirdprojectback.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(MemberController.class)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MemberService memberService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("회원 등록 성공")
    void createMember() throws Exception {
        // given
        MemberRequestDto requestDto = MemberRequestDto.builder()
                .email("test@example.com")
                .name("홍길동")
                .password("1234")
                .height(170)
                .age(30)
                .gender(Gender.MALE)
                .goal("다이어트")
                .build();

        MemberResponseDto responseDto = MemberResponseDto.builder()
                .userId(1L)
                .email("test@example.com")
                .name("홍길동")
                .height(170)
                .age(30)
                .gender(Gender.MALE)
                .goal("다이어트")
                .build();

        Mockito.when(memberService.createMember(Mockito.any())).thenReturn(responseDto);

        // when & then
        mockMvc.perform(post("/api/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1L))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("전체 회원 조회 성공")
    void getAllMembers() throws Exception {
        // given
        MemberResponseDto dto1 = MemberResponseDto.builder()
                .userId(1L).email("a@test.com").name("A").height(170).age(25).gender(Gender.FEMALE).goal("헬스").build();
        MemberResponseDto dto2 = MemberResponseDto.builder()
                .userId(2L).email("b@test.com").name("B").height(180).age(28).gender(Gender.MALE).goal("다이어트").build();

        Mockito.when(memberService.getAllMembers()).thenReturn(List.of(dto1, dto2));

        // when & then
        mockMvc.perform(get("/api/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("회원 단건 조회 성공")
    void getMember() throws Exception {
        // given
        Long id = 1L;
        MemberResponseDto responseDto = MemberResponseDto.builder()
                .userId(id)
                .email("test@example.com")
                .name("홍길동")
                .height(170)
                .age(30)
                .gender(Gender.MALE)
                .goal("다이어트")
                .build();

        Mockito.when(memberService.getMemberById(id)).thenReturn(responseDto);

        // when & then
        mockMvc.perform(get("/api/members/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(id))
                .andExpect(jsonPath("$.name").value("홍길동"));
    }
}
