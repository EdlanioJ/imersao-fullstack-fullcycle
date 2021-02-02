package model

import (
	"time"

	"github.com/asaskevich/govalidator"
	uuid "github.com/satori/go.uuid"
)

//Bank Model
type Bank struct {
	Base    `valid:"required"`
	Code    string     `json:"code" gorm:"type:varcher(20)" valid:"notnull"`
	Name    string     `json:"name" gorm:"type:varcher(255)" valid:"notnull"`
	Account []*Account `gorm:"ForeignKey:BankID" valid:"-"`
}

func (bank *Bank) isValid() error {
	_, err := govalidator.ValidateStruct(bank)

	if err != nil {
		return err
	}
	return nil
}

func NewBank(code string, name string) (*Bank, error) {
	bank := Bank{
		Code: code,
		Name: name,
	}

	bank.ID = uuid.NewV4().String()
	bank.CreatedAt = time.Now()

	error := bank.isValid()

	if error != nil {
		return nil, error
	}
	return &bank, nil
}
