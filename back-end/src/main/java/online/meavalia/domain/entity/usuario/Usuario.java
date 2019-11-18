package online.meavalia.domain.entity.usuario;

import br.com.caelum.stella.validation.CNPJValidator;
import br.com.caelum.stella.validation.CPFValidator;
import online.meavalia.domain.entity.unidade.Unidade;
import online.meavalia.domain.entity.usuario.vinculo.Avaliavel;
import online.meavalia.domain.entity.usuario.vinculo.Operador;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
public class Usuario extends Pessoa implements Serializable {

    private static final long serialVersionUID = -54871266869107167L;

    /*
     * -----------------------------------------------------------
     *                           Foto
     * -----------------------------------------------------------
     */
    /**
     *
     */
    @Transient
    private String recap;

    /**
     *
     */
    @Column
    @JsonIgnore
    private byte[] foto;

    /**
     *
     */
    @Column
    private String fotoPath;

    /**
     *
     */
    @Column
    @JsonIgnore
    private byte[] avatar;

    /**
     *
     */
    @Column
    private String avatarPath;

    /**
     *
     */
    @Column
    @JsonIgnore
    private byte[] thumbnail;

    /**
     *
     */
    @Column
    private String thumbnailPath;

    /**
     * Lista auxiliar que serve para informar se o usuário é um operador
     */
    @JsonProperty
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "usuario")
    private List<Operador> operadores;

    /**
     * Lista auxiliar que serve para informar se o usuário é um avaliável
     */
    @EqualsAndHashCode.Exclude
    @JsonProperty
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "usuario")
    private Set<Avaliavel> avaliaveis;

    /**
     *
     */
    @EqualsAndHashCode.Exclude
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Conta conta;

    /*-------------------------------------------------------------------
     *						CONSTRUCTOR´S
     *-------------------------------------------------------------------*/

    /**
     *
     */
    public Usuario() {
    }

    /**
     *
     */
    public Usuario(final long id, final Object media) {
        this.id = id;
        this.media = media;
    }

    /**
     *
     */
    public Usuario(final long id, final String nome, final String thumbnailPath,
                   final String avatarPath, final String fotoPath, final Object media,
                   final long quantidadeAvaliacoes, final long avaliacoes1, final long avaliacoes2,
                   final long avaliacoes3, final long avaliacoes4, final long avaliacoes5, final Conta conta, final String documento) {

        this.conta = conta;

        this.documento = documento;

        this.id = id;
        this.nome = nome;
        this.thumbnailPath = thumbnailPath;
        this.avatarPath = avatarPath;
        this.fotoPath = fotoPath;

        this.media = media;
        this.quantidadeAvaliacoes = quantidadeAvaliacoes;
        this.avaliacoes1 = avaliacoes1;
        this.avaliacoes2 = avaliacoes2;
        this.avaliacoes3 = avaliacoes3;
        this.avaliacoes4 = avaliacoes4;
        this.avaliacoes5 = avaliacoes5;
    }

    /**
     *
     */
    public Usuario(final long id, final String nome, final String thumbnailPath,
                   final String avatarPath, final String fotoPath, final Conta conta, final String documento) {

        this.conta = conta;

        this.documento = documento;

        this.id = id;
        this.nome = nome;
        this.thumbnailPath = thumbnailPath;
        this.avatarPath = avatarPath;
        this.fotoPath = fotoPath;

    }

    /*-------------------------------------------------------------------
     *						BEHAVIORS
     *-------------------------------------------------------------------*/

    /**
     * Remove '.', '/' e '-'
     *
     * @param documento {String}
     * @return {String}
     */
    private static String prepareDocumento(String documento) {
        if (documento == null) {
            return null;
        }
        if (documento.contains("@")) {
            return documento;
        }

        documento = documento.replaceAll(Pattern.quote("."), "");
        documento = documento.replaceAll(Pattern.quote("/"), "");
        return documento.replaceAll(Pattern.quote("-"), "");
    }

    /**
     * @param documento {String}
     * @return {String}
     */
    private static String validateDocumento(final String documento) {
        if (documento == null || documento.length() < 1) {
            return null;
        }
        if (documento.contains("@")) {
            return documento;
        }

        final String doc = Usuario.prepareDocumento(documento);

        final CNPJValidator cnpjValidator = new CNPJValidator();
        final CPFValidator cpfValidator = new CPFValidator();


        if (cpfValidator.isEligible(doc)) {
            try {
                cpfValidator.assertValid(doc);
            } catch (Exception e) {
                throw new Usuario.CpfException();
            }
        } else if (cnpjValidator.isEligible(doc)) {
            try {
                cnpjValidator.assertValid(doc);
            } catch (Exception e) {
                throw new Usuario.CnpjException();
            }
        } else {
            throw new CpfCnpjException();
        }
        return doc;
    }

    /**
     * @return String
     */
    @Transient
    @JsonProperty
    public String getUnidades() {

        final Set<Unidade> unidades = new HashSet<>();

        if (this.avaliaveis != null && !Objects.requireNonNull(this.avaliaveis).isEmpty())
            unidades.addAll(this.avaliaveis.stream().map(avaliavel -> avaliavel.getUnidadeTipoAvaliacaoDispositivo().getUnidadeTipoAvaliacao().getUnidade()).collect(Collectors.toSet()));
        if (this.operadores != null)
            unidades.addAll(this.operadores.stream().map(Operador::getUnidade).collect(Collectors.toSet()));

        if (unidades.isEmpty())
            return null;
        return unidades.stream().map(a -> a.nome).collect(Collectors.joining(", "));
    }

    /**
     *
     */
    public boolean isOperador() {
        return this.operadores != null && !this.operadores.isEmpty();
    }

    /**
     *
     */
    public boolean isAtendente() {
        return this.avaliaveis != null && !this.avaliaveis.isEmpty();
    }

    /**
     *
     */
    public boolean getIsOperador() {
        return this.isOperador();
    }

    /**
     *
     */
    public boolean getIsAtendente() {
        return this.isAtendente();
    }

    /**
     *
     */
    public boolean getIsAdministrador() {
        return this.conta != null && this.conta.isAdministrador();
    }

    /**
     * Valida o documento
     */
    public void validateDocumento() {
        this.documento = validateDocumento(this.documento);
    }


//    /**
//     * Devolve os pontos e barra ao documento
//     *
//     * @param documento {String}
//     * @return {String}
//     */
//    public static String formatDocumento(final String documento) {
//        if (documento == null || documento.length() < 1) {
//            return null;
//        }
//        if (documento.contains("@")) {
//            return documento;
//        }
//
//        final String doc = Usuario.prepareDocumento(documento);
//
//        final CNPJValidator cnpjValidator = new CNPJValidator();
//        final CPFValidator cpfValidator = new CPFValidator();
//
//
//        final CNPJFormatter cnpjFormatter = new CNPJFormatter();
//        final CPFFormatter cpfFormatter = new CPFFormatter();
//
//        if (cpfValidator.isEligible(doc)) {
//            try {
//                return cpfFormatter.format(doc);
//            } catch (Exception e) {
//                throw new Usuario.CpfException();
//            }
//        } else if (cnpjValidator.isEligible(doc)) {
//            try {
//                return cnpjFormatter.format(doc);
//            } catch (Exception e) {
//                throw new Usuario.CnpjException();
//            }
//        } else {
//            throw new CpfCnpjException();
//        }
//    }

    /**
     *
     */
    @PrePersist
    @PreUpdate
    public void handlePathFoto() {
        if (this.foto != null) {
            this.fotoPath = "./usuarios/" + id + "/foto";
            this.avatarPath = "./usuarios/" + id + "/avatar";
            this.thumbnailPath = "./usuarios/" + id + "/thumbnail";
        } else {
            this.fotoPath = null;
            this.avatarPath = null;
            this.thumbnailPath = null;
        }
    }

    /*-------------------------------------------------------------------
     *						EXCEPTIONS
     *-------------------------------------------------------------------*/

    /**
     *
     */
    public static class CpfException extends RuntimeException {
        /**
         *
         */
        private static final long serialVersionUID = -5267258386816809448L;

        CpfException() {
            super("CPF inválido!");
        }
    }

    /**
     *
     */
    public static class CnpjException extends RuntimeException {
        /**
         *
         */
        private static final long serialVersionUID = -4954516819219451502L;

        CnpjException() {
            super("CNPJ inválido!");
        }
    }

    /**
     *
     */
    public static class CpfCnpjException extends RuntimeException {
        /**
         *
         */
        private static final long serialVersionUID = -4954516329219451502L;

        CpfCnpjException() {
            super("CPF ou CNPJ inválido!");
        }
    }
}
