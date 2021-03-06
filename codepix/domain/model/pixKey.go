package model

import (
	"errors"
	"time"

	"github.com/asaskevich/govalidator"
	uuid "github.com/satori/go.uuid"
)

type PixKey struct {
	Base      `valid:"required"`
	Kind      string  `json:"kind" valid:"notnull"`
	Key       string  `json:"key" valid:"notnull"`
	AccountID string  `gorm:"column:account_id;type:uuid;not null" valid:"-"`
	Account   Account `valid:"-"`
	Status    string  `json:"status" valid:"notnull"`
}

type PixKeyRepositoryInterface interface {
	RegisterKey(pixKey *PixKey) (*PixKey, error)
	FindKeyByKind(key string, kind string) (*PixKey, error)
	AddBank(bank *Bank) error
	AddAccount(account *Account) error
	FindAccount(id string) (*Account, error)
}

func (pixKey *PixKey) isValid() error {
	_, err := govalidator.ValidateStruct(pixKey)

	if pixKey.Kind != "email" && pixKey.Kind != "nif" {
		return errors.New("invalid type of key")
	}

	if pixKey.Status != "active" && pixKey.Status != "inactive" {
		return errors.New("invalid status")
	}
	if err != nil {
		return err
	}
	return nil
}

func NewPixKey(kind string, key string, account *Account) (*PixKey, error) {

	pixKey := PixKey{
		Kind:      kind,
		Key:       key,
		AccountID: account.ID,
		Status:    "active",
	}

	pixKey.ID = uuid.NewV4().String()
	pixKey.CreatedAt = time.Now()

	error := pixKey.isValid()

	if error != nil {
		return nil, error
	}

	return &pixKey, nil
}
