package br.com.tt.painelpreco.api.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.AtaRegistroPrecoDTO;
import br.com.tt.painelpreco.domain.model.AtaRegistroPreco;
import br.com.tt.painelpreco.domain.service.AtaRegistroPrecoService;
import br.com.tt.painelpreco.util.ApiVersion;

@RestController
@RequestMapping(ApiVersion.LATEST + "/atas-registro-preco")
public class AtaRegistroPrecoController {

    @Autowired
    private AtaRegistroPrecoService ataService;

    @GetMapping("/ativas")
    public List<AtaRegistroPrecoDTO> getAtasAtivas() {
        return ataService.findAtasAtivas().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AtaRegistroPrecoDTO toDTO(AtaRegistroPreco ata) {
        AtaRegistroPrecoDTO dto = new AtaRegistroPrecoDTO();
        dto.setUuid(ata.getUuid());
        dto.setNumeroAta(ata.getNumeroAta());
        dto.setAno(ata.getAno());
        dto.setNumeroPncp(ata.getNumeroPncp());
        dto.setDataAssinatura(ata.getDataAssinatura());
        dto.setDataVigenciaInicio(ata.getDataVigenciaInicio());
        dto.setDataVigenciaFim(ata.getDataVigenciaFim());
        dto.setSituacaoNome(ata.getSituacaoNome());
        if (ata.getLicitacao() != null) {
            dto.setLicitacaoNumeroPncp(ata.getLicitacao().getNumeroPncp());
            dto.setLicitacaoObjeto(ata.getLicitacao().getObjeto());
        }
        return dto;
    }
}
